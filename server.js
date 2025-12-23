const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // 모든 도메인 허용 (GitHub Pages 연동을 위해 필요)
app.use(express.json());

// MySQL 연결 풀 생성 (연결 관리가 더 효율적임)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 1. 회원가입 API
app.post('/api/register', async (req, res) => {
    const { user_id, password, nickname, email } = req.body;

    try {
        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (user_id, password, nickname, email) VALUES (?, ?, ?, ?)';
        pool.query(query, [user_id, hashedPassword, nickname, email], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: "이미 존재하는 아이디입니다." });
                }
                return res.status(500).json({ error: "회원가입 중 오류가 발생했습니다." });
            }
            res.json({ message: "회원가입이 완료되었습니다!", id: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
});

// 2. 로그인 API
app.post('/api/login', (req, res) => {
    const { user_id, password } = req.body;

    const query = 'SELECT * FROM users WHERE user_id = ?';
    pool.query(query, [user_id], async (err, results) => {
        if (err) return res.status(500).json({ error: "로그인 처리 중 오류 발생" });
        if (results.length === 0) return res.status(400).json({ error: "존재하지 않는 사용자입니다." });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });

        res.json({
            message: "로그인 성공!",
            user: { id: user.id, user_id: user.user_id, nickname: user.nickname, level: user.level, gold: user.gold }
        });
    });
});

// 3. 어드민 로그인 API
app.post('/api/admin/login', (req, res) => {
    const { admin_id, password } = req.body;
    const query = 'SELECT * FROM admins WHERE admin_id = ?';
    pool.query(query, [admin_id], async (err, results) => {
        if (err) return res.status(500).json({ error: "DB 오류" });
        if (results.length === 0) return res.status(400).json({ error: "관리자 정보가 없습니다." });

        const admin = results[0];
        // 비밀번호 암호화 처리가 되어있다면 bcrypt.compare 사용
        if (password === admin.password) { // 임시로 평문 비교 (보안상 추후 암호화 권장)
            res.json({ message: "어드민 로그인 성공", admin: { id: admin.id, admin_id: admin.admin_id, role: admin.role } });
        } else {
            res.status(400).json({ error: "비밀번호가 틀렸습니다." });
        }
    });
});

// 4. 모든 유저 정보 조회 (어드민 전용)
app.get('/api/admin/users', (req, res) => {
    pool.query('SELECT id, user_id, nickname, level, gold, created_at FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: "데이터 조회 실패" });
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

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
