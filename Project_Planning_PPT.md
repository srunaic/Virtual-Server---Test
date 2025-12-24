# [PPT] OpenWorld Game Ecosystem Planning
## 프로젝트명: Virtual-Server---Test
---

## Slide 1: 프로젝트 개요
### 🎯 목표
- Unity 3D 기반의 오픈월드 게임 시스템 구축
- 자체 서버(Node.js + MySQL)를 통한 유저 데이터 및 게임 상태 관리
- 웹 포털 및 런처를 통한 통합 유저 서비스 제공

---

## Slide 2: 전체 시스템 아키텍처
### 🏗️ 3-Layer Structure
1. **Client Layer**: Unity 3D Game Engine / Web Launcher
2. **Server Layer (API)**: Node.js (Express) + JWT Auth + Localtunnel (Public URL)
3. **Data Layer**: MySQL Database (User/Admin/Game Data)

---

## Slide 3: 데이터베이스 설계 (DB Schema)
### 👥 User DB
- 아이디, 암호화된 비밀번호, 닉네임, 이메일
- 게임 데이터: 레벨, 경험치, 골드, 월드 내 좌표(X, Y, Z)

### 🛡️ Admin DB
- 관리자 아이디, 권한 등급(Admin, Moderator)
- 서비스 공지사항 및 유저 관리 로그

---

## Slide 4: 개발 로드맵 (Roadmap)
### 📅 단계별 계획
- **Phase 1**: DB 및 API 기초 구축 (현재 완료)
    - 회원가입/로그인 로직 완성
- **Phase 2**: 웹 포털 및 어드민 페이지 (Web Portal)
    - 유저 프로필 관리 및 공지사항 웹사이트 구축
- **Phase 3**: Unity C# - API 연동
    - 게임 시작 시 로그인 및 데이터 동기화
- **Phase 4**: 런처 개발 및 배포
    - 버전 체크 및 게임 실행 자동화 툴 제작

---

## Slide 5: 핵심 기능 (Core Features)
### 🔑 인증 및 보안
- `bcryptjs`를 이용한 비밀번호 단방향 암호화
- 외부 접속을 위한 `Localtunnel` 활용

### 🌍 오픈월드 동기화
- 유저 종료 시 마지막 위치 좌표 자동 저장
- 접속 시 실시간 레벨/골드 데이터 동기화

---

## Slide 6: 서비스 확장 계획
### 📈 향후 발전 방향
1. **서버 확장**: 로컬 서버에서 클라우드(AWS/Azure)로 이전
2. **멀티플레이**: Socket.io를 이용한 실시간 유저 동기화 추가
3. **상점 시스템**: 인게임 아이템 웹/앱 통합 구매 시스템

---

## Slide 7: AI-Assisted Unity C# Development
### 🤖 Antigravity AI와의 직접 연동
- **코드 위임**: Unity 내의 핵심 네트워크 로직, 데이터 동기화, UI 제어 코드를 Antigravity AI가 직접 작성 및 최적화
- **실시간 피드백**: 유니티 에디터의 콘솔 로그나 에러 상황을 공유하면 Antigravity가 즉시 디버깅 및 코드 수정 수행
- **C# - API 통신 스크립트 전담**: `UnityWebRequest` 기반의 통신 모듈과 JSON 데이터 처리 로직을 AI가 100% 전담하여 개발 속도 극대화
