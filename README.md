# 🐱‍👤 천사냥이 | 수호수의 계약 (Angel Kitty)

<div align="center">

![License](https://img.shields.io/badge/License-All_Rights_Reserved-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Repository-README_Only-lightgrey?style=for-the-badge)
![Web](https://img.shields.io/badge/🌐_Web-공식_스토리_사이트-purple?style=for-the-badge)

<br/>

버튼을 클릭해주세요

[**🎮 웹에서 스토리 체험하기**](https://virtual-server---test.victoryka123.workers.dev/)    

[![천사냥이 방문](https://img.shields.io/badge/🌟_천사냥이_방문-수호수의_이야기-ff69b4?style=for-the-badge&logo=github&logoColor=white)](https://virtual-server---test.victoryka123.workers.dev/)

</div>

---

## 🛡️ 핵심 자산 보호 안내 (Proprietary & Private Notice)

> **[중요 공지] 본 저장소는 핵심 자산 보호 정책에 따라 소스 코드가 비공개 인프라로 완전 이전되었습니다.**
> 
> 1. **저작권 라이선스 (All Rights Reserved)**:
>    - 본 프로젝트의 세계관, 스토리, 캐릭터 일러스트, UI 디자인, 기획 문서 및 시스템 설계에 대한 모든 권리는 원저작자(**모카 / srunaic**)에게 있습니다.
>    - 사전 서면 동의 없는 무단 복제, 2차 저작물 제작, 상업적/비상업적 도용 및 무단 서비스 배포를 엄격히 금지합니다.
> 2. **풀 소스 비공개 격리 완료**:
>    - 프론트엔드 UI/HTML, 백엔드 서버 엔진, 데이터베이스 로직 등 **모든 실행 코드는 비공개 인프라 및 로컬 백업에 안전하게 격리**되었으며, 깃허브에는 외부 무단 도용 방지를 위해 일체의 소스 코드를 노출하지 않습니다.
>    - 실제 웹 서비스는 독립된 Cloudflare 인프라를 통해 배포/운영됩니다.

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
├── LICENSE                 # All Rights Reserved 독점 저작권 명세
└── README.md               # 프로젝트 공식 안내 문서
```

---

## 📄 라이선스

Copyright (c) 2026 모카 (srunaic). All Rights Reserved.  
자세한 법적 권리 및 이용 제한 규정은 [LICENSE](LICENSE) 파일을 참조하시기 바랍니다.
