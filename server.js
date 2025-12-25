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
        origin: ["http://localhost:3000", "https://srunaic.github.io", "https://virtual-server-test-production.up.railway.app", "*"],
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
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'ngrok-skip-browser-warning']
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
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'virtual_server',
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

// 데이터베이스 초기화 (테이블 자동 생성)
const initializeDatabase = () => {
    const queries = [
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            nickname VARCHAR(50) NOT NULL,
            gold INT DEFAULT 0,
            level INT DEFAULT 1,
            status VARCHAR(20) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS inquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL,
            nickname VARCHAR(50) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS notices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    queries.forEach(query => {
        pool.query(query, (err) => {
            if (err) console.error('[ERROR] 테이블 생성 실패:', err.message);
        });
    });

    // 기본 관리자 계정 생성 (테이블 생성 후 약간의 지연 후 실행)
    setTimeout(async () => {
        const adminId = 'admin';
        const adminPw = 'admin1234';
        const hashedPw = await bcrypt.hash(adminPw, 10);

        pool.query('SELECT * FROM users WHERE user_id = ?', [adminId], (err, results) => {
            if (err) return;
            if (results.length === 0) {
                pool.query('INSERT INTO users (user_id, password, nickname, level) VALUES (?, ?, ?, ?)',
                    [adminId, hashedPw, '관리자', 999], (err) => {
                        if (err) console.error('[ERROR] 관리자 생성 실패:', err.message);
                        else console.log('[INFO] 기본 관리자 계정 생성 완료 (admin/admin1234)');
                    });
            }
        });
    }, 2000);

    console.log('[INFO] 데이터베이스 초기화 확인 완료');
};

initializeDatabase();


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
        console.log(`[REGISTER DEBUG] 중복 확인 시작: user_id="${user_id}"`);
        pool.query('SELECT id FROM users WHERE user_id = ?', [user_id], (err, results) => {
            if (err) {
                console.error("[REGISTER] 중복 확인 DB 오류:", err);
                return res.status(500).json({ error: "서버 오류" });
            }

            console.log(`[REGISTER DEBUG] 쿼리 결과: ${results.length}개 행, 데이터:`, JSON.stringify(results));

            if (results.length > 0) {
                console.log(`[REGISTER] 중복 발견! 기존 ID: ${results[0].id}`);
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

// 2.5. 프로필 업데이트 API
app.post('/api/profile/update', async (req, res) => {
    const { user_id, nickname, email, new_password } = req.body;

    try {
        // 사용자 확인
        pool.query('SELECT id FROM users WHERE user_id = ?', [user_id], async (err, results) => {
            if (err) {
                console.error("프로필 조회 DB 오류:", err);
                return res.status(500).json({ error: "서버 오류" });
            }

            if (results.length === 0) {
                return res.status(400).json({ error: "사용자를 찾을 수 없습니다." });
            }

            const userId = results[0].id;
            let updateFields = [];
            let updateValues = [];

            // 닉네임 업데이트
            if (nickname) {
                updateFields.push('nickname = ?');
                updateValues.push(nickname);
            }

            // 이메일 업데이트
            if (email !== undefined) {
                updateFields.push('email = ?');
                updateValues.push(email);
            }

            // 비밀번호 업데이트
            if (new_password) {
                const hashedPassword = await bcrypt.hash(new_password, 10);
                updateFields.push('password = ?');
                updateValues.push(hashedPassword);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ error: "업데이트할 내용이 없습니다." });
            }

            updateValues.push(userId);
            const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

            pool.query(updateQuery, updateValues, (err, result) => {
                if (err) {
                    console.error("프로필 업데이트 DB 오류:", err);
                    return res.status(500).json({ error: "프로필 업데이트 실패" });
                }

                console.log(`프로필 업데이트: ${user_id}`);
                res.json({ message: "프로필이 성공적으로 업데이트되었습니다." });
            });
        });

    } catch (error) {
        console.error("프로필 업데이트 처리 오류:", error);
        res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
});

// 2. 로그인 API
app.post('/api/login', async (req, res) => {
    const { user_id, password } = req.body;
    console.log(`[DEBUG] 로그인 시도: user_id=${user_id}`);

    try {
        pool.query('SELECT * FROM users WHERE user_id = ?', [user_id], async (err, results) => {
            if (err) {
                console.error("[ERROR] DB 조회 오류 (Login):", err);
                return res.status(500).json({ error: "데이터베이스 조회 중 오류가 발생했습니다.", details: err.message });
            }

            if (results.length === 0) {
                console.warn(`[WARN] 로그인 실패: ${user_id} - 존재하지 않는 사용자`);
                return res.status(400).json({ error: "사용자를 찾을 수 없습니다." });
            }

            const user = results[0];
            try {
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    console.warn(`[WARN] 로그인 실패: ${user_id} - 비밀번호 불일치`);
                    return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
                }

                if (user.status === 'banned') {
                    console.warn(`[WARN] 로그인 실패: ${user_id} - 정지된 계정`);
                    return res.status(403).json({ error: "정지된 계정입니다. 관리자에게 문의하세요." });
                }

                console.log(`[SUCCESS] 로그인 성공: ${user_id}`);
                res.json({
                    message: "로그인 성공!",
                    user: {
                        user_id: user.user_id,
                        nickname: user.nickname,
                        level: user.level,
                        gold: user.gold
                    }
                });
            } catch (err) {
                console.error("[ERROR] 비밀번호 비교 오류:", err);
                res.status(500).json({ error: "인증 처리 중 오류가 발생했습니다." });
            }
        });
    } catch (err) {
        console.error("[ERROR] 예기치 못한 로그인 오류:", err);
        res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
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

// 4. DB 연결 상태 디버깅 API (보안을 위해 비밀번호는 제외)
app.get('/api/debug/db', (req, res) => {
    res.json({
        env: {
            MYSQLHOST: process.env.MYSQLHOST ? 'SET' : 'MISSING',
            MYSQLUSER: process.env.MYSQLUSER ? 'SET' : 'MISSING',
            MYSQLPORT: process.env.MYSQLPORT ? 'SET' : 'MISSING',
            MYSQLDATABASE: process.env.MYSQLDATABASE ? 'SET' : 'MISSING',
            MYSQLPASSWORD: process.env.MYSQLPASSWORD ? 'SET' : 'HIDDEN',
            DB_HOST: process.env.DB_HOST ? 'SET' : 'MISSING'
        },
        pool_config: {
            host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
            user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
            database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'virtual_server',
            port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT) || 3306
        }
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
    pool.query('SELECT id, user_id, nickname, level, gold, status, created_at FROM users', (err, results) => {
        if (err) {
            console.error("유저 조회 DB 오류:", err);
            return res.status(500).json({ error: "데이터 조회 실패", details: err.message });
        }
        res.json(results);
    });
});

// 5. 유저 상태 변경 (제재/해제)
app.post('/api/admin/users/status', (req, res) => {
    const { user_id, status } = req.body;

    // 관리자 계정 보호 로직
    if (user_id === 'admin' || user_id === 'victoryka123') {
        return res.status(403).json({ error: "관리자 계정은 제재할 수 없습니다." });
    }

    pool.query('UPDATE users SET status = ? WHERE user_id = ?', [status, user_id], (err, result) => {
        if (err) {
            console.error("상태 변경 오류:", err);
            return res.status(500).json({ error: "상태 변경 실패" });
        }
        res.json({ message: `유저 상태가 ${status}(으)로 변경되었습니다.` });
    });
});

// 6. 유저 삭제
app.delete('/api/admin/users/:user_id', (req, res) => {
    const { user_id } = req.params;

    // 관리자 계정 보호 로직
    if (user_id === 'admin' || user_id === 'victoryka123') {
        return res.status(403).json({ error: "관리자 계정은 삭제할 수 없습니다." });
    }

    pool.query('DELETE FROM users WHERE user_id = ?', [user_id], (err, result) => {
        if (err) {
            console.error("유저 삭제 오류:", err);
            return res.status(500).json({ error: "유저 삭제 실패" });
        }
        res.json({ message: "유저가 삭제되었습니다." });
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

// --- 유저 문의(Inquiry) API ---

// 1. 문의 작성
app.post('/api/inquiries', (req, res) => {
    console.log("문의 작성 요청 바디:", req.body);
    const { user_id, nickname, title, content } = req.body;
    if (!user_id || !title || !content) {
        return res.status(400).json({ error: "필수 정보가 누락되었습니다." });
    }
    pool.query('INSERT INTO inquiries (user_id, nickname, title, content) VALUES (?, ?, ?, ?)',
        [user_id, nickname || 'anonymous', title, content], (err, result) => {
            if (err) {
                console.error("문의 저장 오류:", err);
                return res.status(500).json({ error: "문의 저장 실패" });
            }
            res.json({ message: "문의가 등록되었습니다.", id: result.insertId });
        });
});

// 2. 본인 문의 내역 조회
app.get('/api/inquiries/:user_id', (req, res) => {
    const { user_id } = req.params;
    pool.query('SELECT * FROM inquiries WHERE user_id = ? ORDER BY created_at DESC', [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: "조회 실패" });
        res.json(results);
    });
});

// 3. 문의 수정
app.put('/api/inquiries/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    pool.query('UPDATE inquiries SET title = ?, content = ? WHERE id = ?', [title, content, id], (err, result) => {
        if (err) return res.status(500).json({ error: "수정 실패" });
        res.json({ message: "문의가 수정되었습니다." });
    });
});

// 4. 문의 삭제
app.delete('/api/inquiries/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM inquiries WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: "삭제 실패" });
        res.json({ message: "문의가 삭제되었습니다." });
    });
});

// 5. [관리자] 전체 문의 조회
app.get('/api/admin/inquiries', (req, res) => {
    pool.query('SELECT * FROM inquiries ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: "조회 실패" });
        res.json(results);
    });
});

// 6. [관리자] 문의 읽음 처리
app.post('/api/admin/inquiries/:id/read', (req, res) => {
    const { id } = req.params;
    pool.query('UPDATE inquiries SET is_read = TRUE WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: "상태 변경 실패" });
        res.json({ message: "읽음 처리되었습니다." });
    });
});

// 서버 시작 - Railway 등 클라우드 환경을 위해 0.0.0.0 바인딩
const HOST = '0.0.0.0';
server.listen(port, HOST, () => {
    console.log(`🚀 서버가 포트 ${port}에서 실행 중입니다. (${HOST})`);
    console.log(`🔌 Socket.io 실시간 연결 활성화`);
});

// 서버 상태 모니터링
setInterval(() => {
    const clients = io.engine.clientsCount;
    console.log(`📊 실시간 모니터링 - 연결된 클라이언트: ${clients}, 서버 상태: 온라인`);
}, 30000); // 30초마다 로그
