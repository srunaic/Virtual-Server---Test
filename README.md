# NexusVerse - 실시간 온라인 플랫폼

현대적인 웹 기술로 구현된 실시간 온라인 플랫폼입니다. 직관적인 사용자 인터페이스와 강력한 백엔드 시스템을 통해 완벽한 사용자 경험을 제공합니다.

## 🚀 시작하기

<div align="center">

### [**🎮 지금 바로 체험하기**](https://srunaic.github.io/Virtual-Server---Test/)

[![플랫폼 접속](https://img.shields.io/badge/🌐_플랫폼_접속-바로가기-blue?style=for-the-badge&logo=google-chrome&logoColor=white)](https://srunaic.github.io/Virtual-Server---Test/)

**관리자 패널**: [⚙️ 시스템 관리](https://srunaic.github.io/Virtual-Server---Test/admin.html)

</div>

## ✨ 주요 특징

### 🎯 사용자 경험
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 완벽 지원
- **다크 테마**: 눈의 피로를 줄이고 집중력을 높이는 모던한 UI
- **실시간 피드백**: 모든 사용자 행동에 즉각적인 응답
- **직관적인 네비게이션**: 복잡함 없이 필요한 기능에 바로 접근

### 🔐 인증 및 보안
- **안전한 회원가입**: bcrypt 기반 비밀번호 암호화
- **세션 관리**: 브라우저 새로고침에도 로그인 상태 유지
- **프로필 관리**: 닉네임, 이메일, 비밀번호 실시간 수정
- **관리자 시스템**: 별도의 관리자 권한 및 대시보드

### 📊 실시간 기능
- **WebSocket 연결**: Socket.io를 통한 양방향 통신
- **라이브 상태**: 서버와 클라이언트 간 실시간 데이터 동기화
- **실시간 알림**: 공지사항 및 시스템 상태 즉시 반영

## 🛠️ 기술 아키텍처

### 프론트엔드
- **Vanilla JavaScript**: 외부 라이브러리 최소화로 빠른 로딩 속도
- **CSS3 Grid & Flexbox**: 유연하고 반응성 있는 레이아웃
- **모던 HTML5**: 시맨틱 마크업과 접근성 고려
- **PWA 지원**: 오프라인 기능 및 앱-like 경험

### 백엔드 & 인프라
- **Node.js + Express**: 확장성 있는 서버 아키텍처
- **Socket.io**: 실시간 양방향 통신
- **MySQL/PostgreSQL**: 유연한 데이터베이스 지원
- **Cloudflare Tunnel**: 안전하고 안정적인 외부 연결

### 보안
- **bcrypt 암호화**: 산업 표준 비밀번호 보안
- **CORS 정책**: 크로스-오리진 요청 안전하게 처리
- **입력 검증**: SQL 인젝션 및 XSS 공격 방지
- **세션 보안**: 클라이언트 측 안전한 상태 관리

## 🚀 설치 및 실행

### 로컬 개발 환경
```bash
# 프로젝트 복제
git clone https://github.com/srunaic/Virtual-Server---Test.git
cd Virtual-Server---Test

# 의존성 설치
npm install

# 데이터베이스 설정 (XAMPP MySQL 권장)
# 1. XAMPP 설치 및 MySQL 시작
# 2. phpMyAdmin에서 'virtual_server' 데이터베이스 생성
# 3. database_schema.sql 실행

# 서버 실행
npm start
# 또는 자동화 스크립트 사용
auto_start_complete.bat
```

### 환경 설정
`.env` 파일 생성:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=virtual_server
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password
NODE_ENV=development
```

## 📱 사용자 가이드

### 일반 사용자
1. **회원가입**: 이메일과 비밀번호로 간단하게 가입
2. **로그인**: 세션이 유지되어 편리한 재접속
3. **프로필 관리**: 닉네임과 개인정보 실시간 수정
4. **실시간 알림**: 시스템 상태 및 공지사항 확인

### 관리자 기능
- **대시보드**: 사용자 통계 및 시스템 모니터링
- **유저 관리**: 가입자 목록 조회 및 관리
- **공지사항**: 실시간 공지 등록 및 관리
- **시스템 모니터링**: 서버 상태 및 로그 확인

## 🔧 개발자 정보

### 프로젝트 구조
```
Virtual-Server---Test/
├── index.html              # 메인 사용자 인터페이스
├── admin.html              # 관리자 패널
├── server.js               # Express 서버 및 API
├── database_schema.sql     # 데이터베이스 스키마
├── auto_start_complete.bat # 자동화 스크립트
├── package.json            # 프로젝트 설정
└── README.md              # 이 파일
```

### API 엔드포인트
- `POST /api/register` - 사용자 등록
- `POST /api/login` - 사용자 로그인
- `POST /api/profile/update` - 프로필 수정
- `GET /api/admin/users` - 유저 목록 (관리자)
- `POST /api/admin/notices` - 공지사항 등록 (관리자)

### 주요 의존성
```json
{
  "express": "^5.2.1",
  "mysql2": "^3.16.0",
  "socket.io": "^4.8.2",
  "bcryptjs": "^3.0.3",
  "cors": "^2.8.5"
}
```

## 📈 성능 및 확장성

### 최적화된 아키텍처
- **코드 분할**: 필요한 기능만 로딩
- **캐싱 전략**: 반복 요청 최적화
- **비동기 처리**: 블로킹 없는 사용자 경험
- **확장성**: 모듈식 구조로 기능 추가 용이

### 배포 및 운영
- **GitHub Pages**: 프론트엔드 무료 호스팅
- **Cloudflare Tunnel**: 백엔드 안전한 노출
- **자동화 스크립트**: 원클릭 배포 및 실행
- **모니터링**: 실시간 시스템 상태 추적

## 📊 프로젝트 구조
```
NexusVerse/
├── index.html              # 메인 사용자 페이지
├── admin.html              # 관리자 대시보드
├── server.js               # Express 서버
├── manifest.json           # PWA 설정
├── sw.js                   # Service Worker
├── database_schema.sql     # DB 스키마
├── auto_start_complete.bat # 자동 시작 스크립트
├── README.md              # 프로젝트 문서
└── package.json           # Node.js 설정
```

## 🎨 디자인 철학

### 시각적 아이덴티티
- **다크 모드 중심**: 현대적인 감성과 편안함
- **네온 액센트**: 바이올렛과 시안의 조화
- **미니멀 디자인**: 불필요한 요소 제거
- **일관성**: 모든 페이지에서 통일된 경험

### 사용자 중심 설계
- **접근성 우선**: 키보드와 스크린 리더 지원
- **모바일 퍼스트**: 터치 인터페이스 최적화
- **성능 중심**: 빠른 로딩과 부드러운 애니메이션
- **직관성**: 학습 곡선 최소화

## 🔮 향후 발전 방향

### 단기 로드맵 (1-3개월)
- [x] 실시간 채팅 시스템
- [x] 프로필 이미지 업로드
- [x] 다크/라이트 테마 토글
- [ ] 푸시 알림 기능
- [ ] 친구 시스템 구현

### 장기 비전 (3-6개월)
- [ ] 모바일 앱 출시 (React Native)
- [ ] 고급 관리자 기능 (로그 분석, 사용자 통계)
- [ ] API 확장 및 서드파티 연동
- [ ] 다국어 지원
- [ ] 고급 보안 기능 (2FA, 세션 관리)

## 🤝 기여하기

프로젝트 개선에 관심 있으신 분들은 언제든 환영합니다!

### 참여 방법
1. **이슈 생성**: 버그 리포트나 기능 제안
2. **코드 기여**: 풀 리퀘스트로 개선사항 제출
3. **토론 참여**: 커뮤니티 의견 공유 및 아이디어 교환

### 개발 환경
```bash
# 필수 사양
Node.js >= 18.0.0
MySQL >= 8.0
npm >= 9.0.0

# 권장 도구
VS Code + Live Server
Postman (API 테스트)
GitKraken (Git GUI)
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스로 배포됩니다. 자유로운 사용과 수정이 가능합니다.

---

**NexusVerse** - 웹 기술의 미래를 보여주는 실시간 플랫폼 🌟

**🌐 [지금 체험하기](https://srunaic.github.io/Virtual-Server---Test/)** | **⚙️ [관리자 패널](https://srunaic.github.io/Virtual-Server---Test/admin.html)** | **📖 [API 문서](https://github.com/srunaic/Virtual-Server---Test/wiki)**
