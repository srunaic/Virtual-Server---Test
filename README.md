# NexusVerse - 가상 세계 플랫폼

현실과 가상을 연결하는 메타버스 플랫폼. AI 기반의 가상 세계를 탐험하고 친구들과 함께 새로운 차원의 엔터테인먼트를 경험해보세요.

## 🌐 바로 체험하기

<div align="center">

### [**🚀 지금 바로 게임 시작하기**](https://srunaic.github.io/Virtual-Server---Test/)
#### *클릭해서 가상 세계로 입장하세요!*

[![게임 접속](https://img.shields.io/badge/🎮_게임_접속-Click_Here-brightgreen?style=for-the-badge&logo=github&logoColor=white)](https://srunaic.github.io/Virtual-Server---Test/)

**관리자 페이지**: [👑 관리자 대시보드](https://srunaic.github.io/Virtual-Server---Test/admin.html)

</div>

## 🎮 주요 기능

### 게임 플랫폼
- **실시간 사용자 관리**: 회원가입, 로그인, 프로필 관리
- **다이나믹 배경 시스템**: 10초마다 자동으로 변하는 판타지 배경
- **반응형 디자인**: 데스크톱부터 모바일까지 모든 기기 지원
- **관리자 대시보드**: 사용자 통계 및 공지사항 관리

### 소셜 기능
- **프로필 시스템**: 닉네임 변경, 레벨/골드 표시
- **관리자 권한**: 최고 관리자와 일반 사용자 구분
- **실시간 알림**: 공지사항 및 이벤트 배너

## 🔧 기술 스택

### 프론트엔드
- **HTML5/CSS3**: 모던 웹 표준을 활용한 반응형 UI
- **Vanilla JavaScript**: 외부 라이브러리 의존성 최소화로 가벼운 성능
- **CSS Grid/Flexbox**: 유연한 레이아웃 시스템
- **PWA 지원**: 홈화면 설치 및 오프라인 기능

### 백엔드
- **Node.js**: 이벤트 기반의 고성능 서버 런타임
- **Express.js**: 간단하고 유연한 웹 프레임워크
- **RESTful API**: 표준화된 데이터 통신
- **미들웨어 시스템**: CORS, JSON 파싱, 정적 파일 서빙

### 데이터베이스
- **MySQL**: 관계형 데이터베이스로 사용자 데이터 안정적 관리
- **커넥션 풀링**: 동시 접속 최적화
- **스키마 설계**: 사용자, 관리자, 공지사항 테이블 구조화

### 보안 및 인증
- **bcrypt**: 비밀번호 암호화로 보안 강화
- **세션 관리**: 클라이언트 상태 유지
- **입력 검증**: SQL 인젝션 및 XSS 방지

## 🖥️ 서버 설정

### 로컬 개발 환경
```bash
# 프로젝트 클론
git clone [repository-url]
cd NexusVerse

# 의존성 설치
npm install

# 데이터베이스 설정 (XAMPP 권장)
# 1. XAMPP 설치 및 MySQL 시작
# 2. phpMyAdmin에서 'virtual_server' 데이터베이스 생성
# 3. database_schema.sql 실행

# 서버 실행
npm start
# 또는 완전 자동화
auto_start_complete.bat
```

### 환경 변수 설정
`.env` 파일에 다음 정보 설정:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=virtual_server
NODE_ENV=development
```

## 📱 PWA 기능

### 홈화면 설치
- **Android Chrome**: "홈 화면에 추가"
- **iOS Safari**: 공유 버튼 → "홈 화면에 추가"
- **오프라인 지원**: 캐시된 콘텐츠로 오프라인 작동
- **푸시 알림**: 이벤트 및 업데이트 알림 (준비중)

## 🎯 관리자 기능

### 대시보드 접근
1. **일반 사용자 페이지**: https://srunaic.github.io/Virtual-Server---Test/
2. **관리자로 로그인**: `victoryka123` / `Tpdlflszkdltm1@`
3. **관리자 페이지 이동**: 프로필 메뉴에서 "관리자 페이지" 클릭
4. **관리자 대시보드**: https://srunaic.github.io/Virtual-Server---Test/admin.html

### 관리자 권한
- **사용자 통계 확인**: 전체 가입자 수, 신규 유저 현황
- **공지사항 관리**: 중요 공지 등록 및 수정
- **사용자 제재**: 계정 정지 및 권한 관리
- **시스템 모니터링**: 서버 상태 및 로그 확인

## 🔄 자동화 시스템

### 원클릭 실행
```bash
# 완전 자동화된 시작
auto_start_complete.bat
```

**포함 기능:**
- MySQL 서비스 자동 시작
- 데이터베이스 연결 확인
- Node.js 서버 실행
- 상태 검증 및 브라우저 자동 열기

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

## 🎨 디자인 특징

### 시각적 테마
- **다크 모드**: 시각적 피로 감소 및 몰입도 향상
- **네온 액센트**: 바이올렛과 시안의 미래지향적 색상
- **반응형 애니메이션**: 부드러운 전환 효과
- **모바일 퍼스트**: 터치 인터페이스 최적화

### UX/UI 원칙
- **직관적 네비게이션**: 복잡한 메뉴 구조 피하기
- **피드백 시스템**: 모든 액션에 시각적/청각적 피드백
- **접근성 고려**: 키보드 및 스크린 리더 지원
- **성능 최적화**: 빠른 로딩과 부드러운 상호작용

## 🚀 향후 계획

### 단기 목표 (1-3개월)
- [x] PWA 기능 구현 및 배포
- [x] 관리자 시스템 완성
- [ ] 모바일 앱 개발 (React Native)
- [ ] 실시간 채팅 시스템 추가
- [ ] 게임 런쳐 프로토타입 개발

### 장기 비전 (3-6개월)
- [ ] 메타버스 월드 구현
- [ ] NFT 마켓플레이스 통합
- [ ] 크로스플랫폼 지원 확대
- [ ] AI 기반 개인화 추천 시스템

## 👨‍💻 기여 방법

프로젝트 개선에 관심 있으시면 언제든 환영합니다!

1. **이슈 생성**: 버그 리포트나 기능 제안
2. **풀 리퀘스트**: 코드 개선 제출
3. **토론 참여**: 커뮤니티 의견 공유

### 개발 환경 설정
```bash
# 필수 요구사항
Node.js >= 18.0
MySQL >= 8.0
XAMPP (권장)

# 권장 도구
VS Code
Git
Postman (API 테스트용)
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스로 배포됩니다. 자유로운 사용과 수정이 가능합니다.

---

**NexusVerse** - 가상과 현실의 경계를 허무는 새로운 엔터테인먼트 플랫폼 🚀

**🌐 [게임 시작하기](https://srunaic.github.io/Virtual-Server---Test/)** | **👑 [관리자 페이지](https://srunaic.github.io/Virtual-Server---Test/admin.html)**
