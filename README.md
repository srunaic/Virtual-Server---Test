# 🐱‍👤 천사냥이 | 수호수의 계약 (Angel Kitty)

<div align="center">

![License](https://img.shields.io/badge/License-All_Rights_Reserved-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Architecture-Skeleton_Specification-orange?style=for-the-badge)
![Web](https://img.shields.io/badge/🌐_Web-공식_스토리_사이트-purple?style=for-the-badge)

<br/>

버튼을 클릭해주세요

[**🎮 웹에서 스토리 체험하기**](https://srunaic.github.io/Virtual-Server---Test/)    

[![천사냥이 방문](https://img.shields.io/badge/🌟_천사냥이_방문-수호수의_이야기-ff69b4?style=for-the-badge&logo=github&logoColor=white)](https://srunaic.github.io/Virtual-Server---Test/)

</div>

---

## 🛡️ 핵심 자산 보호 및 스켈레톤 명세 안내 (Proprietary Notice)

> **[중요 공지] 본 저장소는 포트폴리오 및 기술 명세(UI/UX & Controller Specification) 공개용 스켈레톤 저장소입니다.**
> 
> 1. **저작권 라이선스 (All Rights Reserved)**:
>    - 본 프로젝트의 세계관, 스토리, 캐릭터 일러스트, UI 디자인, 기획 문서 및 시스템 설계에 대한 모든 권리는 원저작자(**모카 / srunaic**)에게 있습니다.
>    - 사전 서면 동의 없는 무단 복제, 2차 저작물 제작, 상업적/비상업적 도용 및 무단 서비스 배포를 엄격히 금지합니다.
> 2. **스켈레톤화(Skeletonization) 적용**:
>    - 본 깃허브에는 **프론트엔드 UI 화면([index.html](index.html), [admin.html](admin.html), [launcher.html](launcher.html))**, **백엔드 컨트롤러 인터페이스([server.js](server.js))**, **데이터베이스 스키마 명세([database_schema.sql](database_schema.sql))**가 노출되어 있습니다.
>    - 핵심 비즈니스 로직, 실제 데이터베이스 쿼리, 암호화 토큰 처리 및 서비스 가동 엔진 원본은 **로컬 비공개 백업 및 프라이빗 인프라**에 안전하게 보관되어 타인이 그대로 복사하여 서비스를 운영하는 것을 원천 차단합니다.

---

## 🌐 시스템 인터페이스 구조 (API Specification)

본 프로젝트의 백엔드는 RESTful API 및 실시간 WebSocket(Socket.io) 인터페이스 명세를 갖추고 있습니다.

### 1. 사용자 및 인증 API
- `POST /api/register` - 신규 사용자 가입 및 유효성 검증
- `POST /api/login` - 인증 및 세션 발급
- `POST /api/profile/update` - 유저 레벨, 재화 및 인게임 좌표 실시간 동기화

### 2. 콘텐츠 및 고객센터 API
- `GET /api/notices` - 메인 웹페이지 공지사항 목록 조회
- `POST /api/inquiries` - 1:1 고객 문의 접수
- `GET /api/inquiries/:user_id` - 특정 유저 문의 이력 조회

### 3. 관리자 및 릴리즈 관리 API
- `POST /api/admin/login` - 운영자 인증 인터페이스
- `GET /api/admin/users` - 전체 회원 모니터링
- `POST /api/admin/users/status` - 제재/활성화 계정 상태 관리
- `GET /api/version/:platform` - PC, Android, iOS 최신 빌드 버전 조회
- `POST /api/admin/release` - Unity 빌드 연동 자동 릴리즈

---

## 📁 저장소 구조

```
Virtual-Server---Test/
├── index.html              # 사용자 공식 웹 스토리 & 트레일러 페이지 (UI)
├── admin.html              # 관리자 운영 대시보드 UI
├── launcher.html           # 전용 게임 런처 인터페이스 UI
├── inquiry.html            # 1:1 고객센터 UI
├── register.html           # 회원가입 UI
├── angelic.css             # Glassmorphism 테마 스타일시트
├── rumi.jpg                # 캐릭터 일러스트 리소스
├── launcher_bg.jpg         # 런처 배경 리소스
├── server.js               # [Skeleton] 백엔드 컨트롤러 인터페이스 명세
├── database_schema.sql     # [Skeleton] 데이터 모델 스키마 명세
├── LICENSE                 # All Rights Reserved 독점 저작권 명세
└── README.md               # 프로젝트 안내 및 명세 문서
```

---

## 📄 라이선스

Copyright (c) 2026 모카 (srunaic). All Rights Reserved.  
자세한 법적 권리 및 이용 제한 규정은 [LICENSE](LICENSE) 파일을 참조하시기 바랍니다.
