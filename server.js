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

// 데이터베이스 연결 테스트 및 초기 데이터 설정
pool.getConnection((err, connection) => {
    if (err) {
        console.error('데이터베이스 연결 실패:', err);
        console.error('환경변수 확인 필요: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
        return;
    }

    console.log('데이터베이스 연결 성공!');

    // 데이터베이스 정리 (한 번만 실행)
    console.log('데이터베이스 초기화 및 정리 시작...');

    // 1. 기존 관리자 데이터 정리 (victoryka123만 유지)
    connection.query(`
        DELETE FROM admins WHERE admin_id != 'victoryka123'
    `, (err, result) => {
        if (err) {
            console.error('기존 관리자 데이터 정리 오류:', err);
        } else {
            console.log(`기존 관리자 ${result.affectedRows}명 정리 완료`);
        }
    });

    // 2. victoryka123 관리자 권한 설정
    connection.query(`
        INSERT IGNORE INTO admins (admin_id, password, role) VALUES
        ('victoryka123', 'Tpdlflszkdltm1@', 'superadmin')
    `, (err) => {
        if (err) {
            console.error('victoryka123 관리자 설정 오류:', err);
        } else {
            console.log('victoryka123 관리자 권한 설정 완료');
        }
    });

    // 3. 불필요한 유저 데이터 정리 (victoryka123만 유지)
    connection.query(`
        DELETE FROM users WHERE user_id != 'victoryka123'
    `, (err, result) => {
        if (err) {
            console.error('불필요한 유저 삭제 오류:', err);
        } else {
            console.log(`불필요한 유저 ${result.affectedRows}명 삭제 완료`);
        }
    });

    // 4. victoryka123 유저 데이터 확인/추가
    connection.query(`
        INSERT IGNORE INTO users (user_id, password, nickname, email, level, gold) VALUES
        ('victoryka123', 'Tpdlflszkdltm1@', '나노도로시', 'nanodorosi@example.com', 99, 999999)
    `, (err) => {
        if (err) {
            console.error('victoryka123 유저 데이터 삽입 오류:', err);
        } else {
            console.log('victoryka123 유저 데이터 확인/추가 완료');
        }
        connection.release();
    });
});

// 0. 서버 상태 체크 API
app.get('/api/test', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        message: 'Server is running successfully'
    });
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
                console.error("회원가입 DB 오류:", err);
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

// 2. 로그인 API (일반 사용자 + 관리자 모두 가능)
app.post('/api/login', (req, res) => {
    const { user_id, password } = req.body;

    // 먼저 users 테이블에서 사용자 찾기
    const userQuery = 'SELECT * FROM users WHERE user_id = ?';
    pool.query(userQuery, [user_id], async (err, userResults) => {
        if (err) {
            console.error("로그인 DB 오류:", err);
            return res.status(500).json({ error: "로그인 처리 중 오류 발생" });
        }

        let user = null;
        let isAdmin = false;

        if (userResults.length > 0) {
            // 일반 사용자인 경우
            user = userResults[0];
        } else {
            // users 테이블에 없으면 admins 테이블에서 찾기
            const adminQuery = 'SELECT * FROM admins WHERE admin_id = ?';
            pool.query(adminQuery, [user_id], async (adminErr, adminResults) => {
                if (adminErr) {
                    console.error("관리자 로그인 DB 오류:", adminErr);
                    return res.status(500).json({ error: "로그인 처리 중 오류 발생" });
                }

                if (adminResults.length === 0) {
                    return res.status(400).json({ error: "존재하지 않는 사용자입니다." });
                }

                // 관리자인 경우
                const admin = adminResults[0];
                isAdmin = true;

                // 관리자 비밀번호는 평문으로 저장되어 있음 (보안 개선 필요)
                if (password !== admin.password) {
                    return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
                }

                // 관리자 정보를 유저 형식으로 변환
                user = {
                    id: admin.id,
                    user_id: admin.admin_id,
                    nickname: admin.admin_id, // 관리자 아이디를 닉네임으로 사용
                    level: 99, // 관리자는 최고 레벨
                    gold: 999999, // 관리자는 최대 골드
                    is_admin: true // 관리자 표시
                };

                // 로그인 성공 응답
                res.json({
                    message: "관리자 로그인 성공!",
                    user: {
                        id: user.id,
                        user_id: user.user_id,
                        nickname: user.nickname,
                        level: user.level,
                        gold: user.gold,
                        is_admin: true
                    }
                });
            });
            return; // admins 테이블 조회로 넘어가므로 여기서 종료
        }

        // 일반 사용자 로그인 처리
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });

        res.json({
            message: "로그인 성공!",
            user: {
                id: user.id,
                user_id: user.user_id,
                nickname: user.nickname,
                level: user.level,
                gold: user.gold,
                is_admin: false
            }
        });
    });
});

// 3. 어드민 로그인 API
app.post('/api/admin/login', (req, res) => {
    const { admin_id, password } = req.body;
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
            res.json({ message: "어드민 로그인 성공", admin: { id: admin.id, admin_id: admin.admin_id, role: admin.role } });
        } else {
            res.status(400).json({ error: "비밀번호가 틀렸습니다." });
        }
    });
});

// 4. 모든 유저 정보 조회 (어드민 전용)
app.get('/api/admin/users', (req, res) => {
    console.log('사용자 목록 조회 요청 받음');

    // 데이터베이스 연결 상태 확인
    if (!pool) {
        console.error('데이터베이스 풀 연결 없음');
        return res.status(500).json({
            error: "데이터베이스 연결 실패",
            details: "데이터베이스 풀 연결이 설정되지 않았습니다."
        });
    }

    // 오늘 날짜 계산 (KST 기준)
    const today = new Date();
    today.setHours(today.getHours() + 9); // KST로 변환
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식

    // 유저 정보와 관리자 여부를 함께 조회
    const userQuery = `
        SELECT
            u.id, u.user_id, u.nickname, u.level, u.gold, u.created_at,
            CASE WHEN a.admin_id IS NOT NULL THEN 1 ELSE 0 END as is_admin,
            a.role as admin_role
        FROM users u
        LEFT JOIN admins a ON u.user_id = a.admin_id
        ORDER BY u.created_at DESC
    `;

    // 오늘 가입한 유저 수 계산
    const newUsersQuery = `
        SELECT COUNT(*) as new_users_today
        FROM users
        WHERE DATE(created_at) = ?
    `;

    // 두 쿼리를 동시에 실행
    Promise.all([
        new Promise((resolve, reject) => {
            pool.query(userQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        }),
        new Promise((resolve, reject) => {
            pool.query(newUsersQuery, [todayStr], (err, results) => {
                if (err) reject(err);
                else resolve(results[0].new_users_today);
            });
        })
    ]).then(([users, newUsersCount]) => {
        console.log(`사용자 ${users.length}명 조회 완료, 오늘 가입: ${newUsersCount}명`);

        // 응답에 통계 정보 추가
        const response = {
            users: users,
            stats: {
                total_users: users.length,
                new_users_today: newUsersCount
            }
        };

        res.json(response);
    }).catch(err => {
        console.error("유저 조회 DB 오류:", err);
        return res.status(500).json({
            error: "데이터 조회 실패",
            details: err.message,
            sqlState: err.sqlState,
            errno: err.errno
        });
    });
});

// 테스트 라우트
console.log('등록: GET /test');
app.get('/test', (req, res) => {
    res.json({ message: 'Test GET works!', timestamp: new Date().toISOString() });
});

console.log('등록: POST /test-post');
app.post('/test-post', (req, res) => {
    res.json({ message: 'Test POST works!', params: req.params, body: req.body });
});

// 6. 특정 유저 삭제 (어드민 전용) - 임시로 GET 사용
console.log('등록: GET /api/admin/users/delete/:id');
app.get('/api/admin/users/delete/:id', (req, res) => {
    const userId = req.params.id;

    console.log(`사용자 삭제 요청: ID ${userId}`);

    // 데이터베이스 연결 상태 확인
    if (!pool) {
        console.error('데이터베이스 풀 연결 없음');
        return res.status(500).json({
            error: "데이터베이스 연결 실패",
            details: "데이터베이스 풀 연결이 설정되지 않았습니다."
        });
    }

    // 먼저 사용자가 존재하는지 확인
    pool.query('SELECT user_id FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error("유저 조회 DB 오류:", err);
            return res.status(500).json({
                error: "사용자 조회 실패",
                details: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "존재하지 않는 사용자입니다." });
        }

        const userIdStr = results[0].user_id;

        // 관리자인 경우 삭제 불가
        pool.query('SELECT admin_id FROM admins WHERE admin_id = ?', [userIdStr], (err, adminResults) => {
            if (err) {
                console.error("관리자 권한 확인 DB 오류:", err);
                return res.status(500).json({
                    error: "관리자 권한 확인 실패",
                    details: err.message
                });
            }

            if (adminResults.length > 0) {
                return res.status(400).json({
                    error: "관리자 계정은 삭제할 수 없습니다. 먼저 관리자 권한을 해제하세요."
                });
            }

            // 사용자를 삭제
            pool.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
                if (err) {
                    console.error("유저 삭제 DB 오류:", err);
                    return res.status(500).json({
                        error: "사용자 삭제 실패",
                        details: err.message
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "삭제할 사용자를 찾을 수 없습니다." });
                }

                console.log(`사용자 삭제 완료: ${userIdStr} (ID: ${userId})`);
                res.json({
                    message: `사용자 "${userIdStr}"이(가) 성공적으로 삭제되었습니다.`,
                    deletedUserId: userId,
                    deletedUserName: userIdStr
                });
            });
        });
    });
});

// 7. 공지사항 조회 (모든 사용자)
app.get('/api/notices', (req, res) => {
    console.log('공지사항 조회 요청');

    // 데이터베이스 연결 상태 확인
    if (!pool) {
        console.error('데이터베이스 풀 연결 없음');
        return res.status(500).json({
            error: "데이터베이스 연결 실패",
            details: "데이터베이스 풀 연결이 설정되지 않았습니다."
        });
    }

    // 최신 공지사항 5개 조회 (최신순)
    pool.query('SELECT id, title, content, created_at FROM notices ORDER BY created_at DESC LIMIT 5', (err, results) => {
        if (err) {
            console.error("공지사항 조회 DB 오류:", err);
            return res.status(500).json({
                error: "공지사항 조회 실패",
                details: err.message
            });
        }

        console.log(`${results.length}개의 공지사항 조회 완료`);
        res.json(results);
    });
});

// 8. 관리자 권한 부여/해제 (어드민 전용)
app.post('/api/admin/users/:id/toggle-admin', (req, res) => {
    const userId = req.params.id;
    const { action } = req.body; // 'grant' 또는 'revoke'

    console.log(`관리자 권한 ${action} 요청: 사용자 ID ${userId}`);

    if (!pool) {
        console.error('데이터베이스 풀 연결 없음');
        return res.status(500).json({
            error: "데이터베이스 연결 실패",
            details: "데이터베이스 풀 연결이 설정되지 않았습니다."
        });
    }

    // 먼저 사용자가 존재하는지 확인
    pool.query('SELECT user_id FROM users WHERE id = ?', [userId], (err, userResults) => {
        if (err) {
            console.error("유저 조회 DB 오류:", err);
            return res.status(500).json({
                error: "사용자 조회 실패",
                details: err.message
            });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ error: "존재하지 않는 사용자입니다." });
        }

        const userIdStr = userResults[0].user_id;

        if (action === 'grant') {
            // 관리자 권한 부여
            pool.query('INSERT IGNORE INTO admins (admin_id, password, role) VALUES (?, ?, ?)',
                [userIdStr, 'temp_password', 'moderator'], (err, result) => {
                if (err) {
                    console.error("관리자 권한 부여 DB 오류:", err);
                    return res.status(500).json({
                        error: "관리자 권한 부여 실패",
                        details: err.message
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(400).json({ error: "이미 관리자 권한이 있습니다." });
                }

                console.log(`관리자 권한 부여 완료: ${userIdStr}`);
                res.json({
                    message: `사용자 "${userIdStr}"에게 관리자 권한이 부여되었습니다.`,
                    userId: userId,
                    userIdStr: userIdStr,
                    action: 'granted'
                });
            });
        } else if (action === 'revoke') {
            // 관리자 권한 해제 (최소 1명의 슈퍼관리자는 남겨야 함)
            pool.query('SELECT role FROM admins WHERE admin_id = ?', [userIdStr], (err, adminResults) => {
                if (err) {
                    console.error("관리자 권한 확인 DB 오류:", err);
                    return res.status(500).json({
                        error: "관리자 권한 확인 실패",
                        details: err.message
                    });
                }

                if (adminResults.length === 0) {
                    return res.status(400).json({ error: "관리자 권한이 없는 사용자입니다." });
                }

                const adminRole = adminResults[0].role;

                // 슈퍼관리자인 경우, 다른 슈퍼관리자가 있는지 확인
                if (adminRole === 'superadmin') {
                    pool.query('SELECT COUNT(*) as superadmin_count FROM admins WHERE role = ?',
                        ['superadmin'], (err, countResults) => {
                        if (err) {
                            console.error("슈퍼관리자 수 확인 DB 오류:", err);
                            return res.status(500).json({
                                error: "슈퍼관리자 수 확인 실패",
                                details: err.message
                            });
                        }

                        if (countResults[0].superadmin_count <= 1) {
                            return res.status(400).json({
                                error: "최소 1명의 슈퍼관리자는 유지되어야 합니다."
                            });
                        }

                        // 슈퍼관리자 권한 해제 진행
                        revokeAdminRights();
                    });
                } else {
                    // 일반 관리자 권한 해제
                    revokeAdminRights();
                }

                function revokeAdminRights() {
                    pool.query('DELETE FROM admins WHERE admin_id = ?', [userIdStr], (err, result) => {
                        if (err) {
                            console.error("관리자 권한 해제 DB 오류:", err);
                            return res.status(500).json({
                                error: "관리자 권한 해제 실패",
                                details: err.message
                            });
                        }

                        console.log(`관리자 권한 해제 완료: ${userIdStr}`);
                        res.json({
                            message: `사용자 "${userIdStr}"의 관리자 권한이 해제되었습니다.`,
                            userId: userId,
                            userIdStr: userIdStr,
                            action: 'revoked'
                        });
                    });
                }
            });
        } else {
            return res.status(400).json({ error: "잘못된 action입니다. 'grant' 또는 'revoke'를 사용하세요." });
        }
    });
});

// 9. 공지사항 등록
app.post('/api/admin/notices', (req, res) => {
    const { title, content } = req.body;
    pool.query('INSERT INTO notices (title, content) VALUES (?, ?)', [title, content], (err, result) => {
        if (err) return res.status(500).json({ error: "공지 저장 실패" });
        res.json({ message: "공지사항이 등록되었습니다." });
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`서버가 http://0.0.0.0:${port} 에서 실행 중입니다.`);
});
