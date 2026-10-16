-- ============================================================================
-- [PROPRIETARY & CONFIDENTIAL - SKELETON SCHEMA SPECIFICATION]
-- Project: 우리 집 천사냥이 일상물 (Angel Kitty)
-- Author: 모카 (srunaic)
-- Copyright (c) 2026 모카. All Rights Reserved.
-- License: UNLICENSED (All Rights Reserved)
-- Notice:
-- 본 스키마 명세는 포트폴리오 및 데이터 모델 아키텍처 확인용으로 공개되었습니다.
-- 실제 운영 환경의 트리거, 인덱스, 민감 시드 데이터는 비공개 인프라에 보관됩니다.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS virtual_server;
USE virtual_server;

-- 1. 유저 계정 및 인게임 프로필 데이터 명세
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,      -- 고유 로그인 계정
    password VARCHAR(255) NOT NULL,          -- 단방향 암호화 해시 (Bcrypt)
    email VARCHAR(100),                      -- 유저 이메일
    nickname VARCHAR(50) NOT NULL,           -- 인게임 캐릭터 닉네임
    level INT DEFAULT 1,                     -- 레벨
    exp INT DEFAULT 0,                       -- 경험치
    gold INT DEFAULT 0,                      -- 재화
    status VARCHAR(20) DEFAULT 'active',     -- 계정 상태 (active / suspended)
    pos_x FLOAT DEFAULT 0.0,                 -- 인게임 좌표계 X
    pos_y FLOAT DEFAULT 0.0,                 -- 인게임 좌표계 Y
    pos_z FLOAT DEFAULT 0.0,                 -- 인게임 좌표계 Z
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 관리자 권한 및 운영자 테이블 명세
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(50) NOT NULL UNIQUE,     -- 관리자 고유 식별자
    password VARCHAR(255) NOT NULL,          -- 관리자 인증 해시
    role VARCHAR(20) DEFAULT 'moderator',    -- 권한 등급 (admin, moderator)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 웹 서비스 공지사항 테이블 명세
CREATE TABLE IF NOT EXISTS notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 1:1 고객 문의 테이블 명세
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. 플랫폼별 버전 관리 및 배포 명세
CREATE TABLE IF NOT EXISTS app_versions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(20) NOT NULL,           -- PC, Android, iOS
    version VARCHAR(50) NOT NULL,            -- SemVer 버전 번호
    url VARCHAR(255) NOT NULL,               -- 인스톨러 배포 링크
    changelog TEXT,                          -- 업데이트 패치노트
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
