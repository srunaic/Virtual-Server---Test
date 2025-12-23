const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://srunaic.github.io", "https://orange-teams-listen.loca.lt", "https://wild-nights-spend.loca.lt", "https://cyan-singers-rush.loca.lt", "https://solid-pans-doubt.loca.lt", "https://grumpy-parts-repeat.loca.lt", "https://hornless-yer-scleritic.ngrok-free.dev", "*"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

const port = process.env.PORT || 3000;

// Supabase 클라이언트 초기화 (폴백용)
const supabase = createClient(
    process.env.SUPABASE_URL || 'https://your-project.supabase.co',
    process.env.SUPABASE_ANON_KEY || 'your-anon-key'
);

// 미들웨어 설정
app.use(express.json());

// CORS 설정 - 완전 개방 (실시간 연결을 위해)
app.use(cors({
    origin: true, // 모든 오리진 허용
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Socket.io 연결 처리
io.on('connection', (socket) => {
    console.log('클라이언트 연결됨:', socket.id);

    // 서버 상태 실시간 전송
    const statusInterval = setInterval(() => {
        socket.emit('server_status', {
            status: 'online',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            connections: io.engine.clientsCount
        });
    }, 5000); // 5초마다 상태 전송

    // 연결 해제 시 정리
    socket.on('disconnect', () => {
        console.log('클라이언트 연결 해제:', socket.id);
        clearInterval(statusInterval);
    });

    // 핑-퐁으로 연결 상태 확인
    socket.on('ping', () => {
        socket.emit('pong', { timestamp: Date.now() });
    });

    // 사용자 온라인 상태 업데이트
    socket.on('user_online', (data) => {
        socket.broadcast.emit('user_status_update', {
            user_id: data.user_id,
            status: 'online',
            timestamp: new Date().toISOString()
        });
    });
});

// MySQL 연결 풀 생성 (연결 관리가 더 효율적임)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'virtual_server',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
});

// 연결 상태 모니터링
pool.on('connection', (connection) => {
    console.log('MySQL 연결됨 - ID:', connection.threadId);
});

pool.on('error', (err) => {
    console.error('MySQL 풀 에러:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('MySQL 연결 재시도...');
    }
});


// 1. 회원가입 API
app.post('/api/register', async (req, res) => {
    const { user_id, password, nickname, email } = req.body;

    // 입력 검증
    if (!user_id || !password || !nickname) {
        return res.status(400).json({ error: "아이디, 비밀번호, 닉네임은 필수입니다." });
    }

    if (user_id.length < 3 || user_id.length > 20) {
        return res.status(400).json({ error: "아이디는 3-20자 사이여야 합니다." });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "비밀번호는 최소 6자 이상이어야 합니다." });
    }

    try {
        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 아이디 중복 확인
        pool.query('SELECT id FROM users WHERE user_id = ?', [user_id], (err, results) => {
            if (err) {
                console.error("중복 확인 DB 오류:", err);
                return res.status(500).json({ error: "서버 오류" });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: "이미 존재하는 아이디입니다." });
            }

            // 사용자 등록
            pool.query('INSERT INTO users (user_id, password, nickname, email) VALUES (?, ?, ?, ?)',
                [user_id, hashedPassword, nickname, email || null], (err, result) => {
                if (err) {
                    console.error("사용자 등록 DB 오류:", err);
                    return res.status(500).json({ error: "회원가입 중 오류가 발생했습니다." });
                }

                console.log(`새 사용자 등록: ${user_id}`);
                res.json({ message: "회원가입이 완료되었습니다!", id: result.insertId });
            });
        });

    } catch (error) {
        console.error("회원가입 처리 오류:", error);
        res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
});

// 2. 로그인 API
app.post('/api/login', async (req, res) => {
    const { user_id, password } = req.body;

    try {
        pool.query('SELECT * FROM users WHERE user_id = ?', [user_id], async (err, results) => {
            if (err) {
                console.error("로그인 DB 오류:", err);
                return res.status(500).json({ error: "로그인 처리 중 오류 발생" });
            }

            if (results.length === 0) {
                return res.status(400).json({ error: "존재하지 않는 사용자입니다." });
            }

            const user = results[0];

            try {
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
                }

                res.json({
                    message: "로그인 성공!",
                    user: {
                        id: user.id,
                        user_id: user.user_id,
                        nickname: user.nickname,
                        level: user.level || 1,
                        gold: user.gold || 0
                    }
                });
            } catch (bcryptErr) {
                console.error("bcrypt 비교 오류:", bcryptErr);
                return res.status(500).json({ error: "비밀번호 검증 중 오류 발생" });
            }
        });
    } catch (error) {
        console.error("로그인 처리 오류:", error);
        return res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
});

// 3. 서버 상태 테스트 API
app.get('/api/test', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        message: 'Server is running successfully'
    });
});

// 4. 어드민 로그인 API
app.post('/api/admin/login', (req, res) => {
    const { admin_id, password } = req.body;

    // 환경변수에서 관리자 정보 가져오기 (보안 강화)
    const envAdminUsername = process.env.ADMIN_USERNAME || 'victoryka123';
    const envAdminPassword = process.env.ADMIN_PASSWORD;

    // 환경변수에 설정된 관리자 계정으로 로그인 시도
    if (admin_id === envAdminUsername && password === envAdminPassword) {
        return res.json({
            message: "어드민 로그인 성공",
            admin: {
                id: 1,
                admin_id: envAdminUsername,
                role: 'superadmin',
                login_method: 'env_credentials'
            }
        });
    }

    // DB에서 관리자 조회 (기존 방식 유지)
    const query = 'SELECT * FROM admins WHERE admin_id = ?';
    pool.query(query, [admin_id], async (err, results) => {
        if (err) {
            console.error("어드민 로그인 DB 오류:", err);
            return res.status(500).json({ error: "DB 오류" });
        }
        if (results.length === 0) return res.status(400).json({ error: "관리자 정보가 없습니다." });

        const admin = results[0];
        // 비밀번호 암호화 처리가 되어있다면 bcrypt.compare 사용
        if (password === admin.password) { // 임시로 평문 비교 (보안상 추후 암호화 권장)
            res.json({
                message: "어드민 로그인 성공",
                admin: {
                    id: admin.id,
                    admin_id: admin.admin_id,
                    role: admin.role,
                    login_method: 'db_credentials'
                }
            });
        } else {
            res.status(400).json({ error: "비밀번호가 틀렸습니다." });
        }
    });
});

// 4. 모든 유저 정보 조회 (어드민 전용)
app.get('/api/admin/users', (req, res) => {
    pool.query('SELECT id, user_id, nickname, level, gold, created_at FROM users', (err, results) => {
        if (err) {
            console.error("유저 조회 DB 오류:", err);
            return res.status(500).json({ error: "데이터 조회 실패", details: err.message });
        }
        res.json(results);
    });
});

// 5. 공지사항 등록
app.post('/api/admin/notices', (req, res) => {
    const { title, content } = req.body;
    pool.query('INSERT INTO notices (title, content) VALUES (?, ?)', [title, content], (err, result) => {
        if (err) return res.status(500).json({ error: "공지 저장 실패" });
        res.json({ message: "공지사항이 등록되었습니다." });
    });
});

// 서버 시작
server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 서버가 포트 ${port}에서 실행 중입니다.`);
    console.log(`🌐 http://localhost:${port}`);
    console.log(`🔌 Socket.io 실시간 연결 활성화`);
    console.log(`📊 연결된 클라이언트 수: ${io.engine.clientsCount}`);
});

// 서버 상태 모니터링
setInterval(() => {
    const clients = io.engine.clientsCount;
    console.log(`📊 실시간 모니터링 - 연결된 클라이언트: ${clients}, 서버 상태: 온라인`);
}, 30000); // 30초마다 로그
