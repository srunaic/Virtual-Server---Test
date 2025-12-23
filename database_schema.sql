-- 데이터베이스 생성 (이미 있다면 생략 가능)
CREATE DATABASE IF NOT EXISTS testdb;
USE testdb;

-- 1. 유저 테이블 (가입/로그인 및 게임 데이터 저장)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,      -- 로그인 아이디
    password VARCHAR(255) NOT NULL,          -- 암호화된 비밀번호
    email VARCHAR(100),                      -- 이메일
    nickname VARCHAR(50) NOT NULL,           -- 인게임 닉네임
    level INT DEFAULT 1,                     -- 유저 레벨
    exp INT DEFAULT 0,                       -- 경험치
    gold INT DEFAULT 0,                      -- 보유 골드
    pos_x FLOAT DEFAULT 0.0,                 -- X 좌표
    pos_y FLOAT DEFAULT 0.0,                 -- Y 좌표
    pos_z FLOAT DEFAULT 0.0,                 -- Z 좌표
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 관리자 테이블 (운영 및 제재 권한 서버 관리)
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(50) NOT NULL UNIQUE,     -- 관리자 아이디
    password VARCHAR(255) NOT NULL,          -- 비밀번호
    role VARCHAR(20) DEFAULT 'moderator',    -- 권한 (admin, moderator, developer)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 초기 관리자 데이터 예시 (비밀번호는 예시입니다)
-- INSERT INTO admins (admin_id, password, role) VALUES ('admin', 'hashed_password', 'admin');
