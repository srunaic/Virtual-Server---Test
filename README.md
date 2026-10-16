# 🐱‍👤 천사냥이 | 수호수의 계약 (Angel Kitty)

버튼을 클릭해주세요

[**🎮 웹에서 스토리 체험하기**](https://srunaic.github.io/Virtual-Server---Test/)    

[![천사냥이 방문](https://img.shields.io/badge/🌟_천사냥이_방문-수호수의_이야기-ff69b4?style=for-the-badge&logo=github&logoColor=white)](https://srunaic.github.io/Virtual-Server---Test/)

</div>


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
├── index.html              # 사용자 공식 웹 스토리 & 트레일러 페이지
├── admin.html              # 관리자 운영 대시보드 UI
├── launcher.html           # 전용 게임 런처 인터페이스
├── inquiry.html            # 1:1 고객센터 UI
├── register.html           # 회원가입 UI
├── angelic.css             # Glassmorphism 테마 스타일시트
├── server.js               # [Skeleton] 백엔드 컨트롤러 인터페이스 명세
├── database_schema.sql     # [Skeleton] 데이터 모델 스키마 명세
├── AngelKittyLauncher.bat  # 런처 자동 구성 배치파일
├── package.json            # Node.js 의존성 및 런처 빌드 설정
├── LICENSE                 # All Rights Reserved 독점 저작권 명세
└── README.md               # 프로젝트 아키텍처 문서
```

---

## 📄 라이선스

Copyright (c) 2026 모카 (srunaic). All Rights Reserved.  
자세한 법적 권리 및 이용 제한 규정은 [LICENSE](LICENSE) 파일을 참조하시기 바랍니다.
