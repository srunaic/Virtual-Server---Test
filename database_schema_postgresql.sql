-- PostgreSQL용 데이터베이스 스키마 (Railway 배포용)

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    level INTEGER DEFAULT 1,
    gold INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 관리자 테이블
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    admin_id VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 공지사항 테이블
CREATE TABLE IF NOT EXISTS notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 기본 관리자 계정 (실제 운영 시에는 별도로 생성)
-- Railway에서는 환경변수로 관리자 계정을 설정하는 것을 권장합니다
