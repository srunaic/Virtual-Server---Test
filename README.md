# AIAgentGame - 가상 세계 플랫폼

AI 기반의 가상 세계를 탐험하고 친구들과 함께 즐기는 인터랙티브 플랫폼입니다. 현실과 가상을 넘나드는 새로운 차원의 엔터테인먼트를 경험해보세요.

## 🌐 바로 체험하기

<div align="center">

### [**🚀 지금 바로 게임 시작하기**](https://srunaic.github.io/Virtual-Server---Test/)
#### *클릭해서 가상 세계로 입장하세요!*

[![게임 접속](https://img.shields.io/badge/🎮_게임_접속-Click_Here-brightgreen?style=for-the-badge&logo=github&logoColor=white)](https://srunaic.github.io/Virtual-Server---Test/)

**관리자 페이지**: [👑 관리자 대시보드](https://srunaic.github.io/Virtual-Server---Test/admin.html)

</div>

## 🚀 주요 기능

### 🎮 게임 플랫폼
- **실시간 사용자 관리**: 회원가입, 로그인, 프로필 관리
- **다이나믹 배경 시스템**: 10초마다 자동으로 변하는 판타지 배경
- **반응형 디자인**: 데스크톱부터 모바일까지 모든 기기 지원
- **관리자 대시보드**: 사용자 통계 및 공지사항 관리

### 👥 소셜 기능
- **프로필 시스템**: 닉네임 변경, 레벨/골드 표시
- **관리자 권한**: 최고 관리자와 일반 사용자 구분
- **실시간 알림**: 공지사항 및 이벤트 배너

### 🔧 기술 스택

#### 프론트엔드
- **HTML5/CSS3**: 모던 웹 표준을 활용한 반응형 UI
- **Vanilla JavaScript**: 외부 라이브러리 의존성 최소화로 가벼운 성능
- **CSS Grid/Flexbox**: 유연한 레이아웃 시스템
- **모바일 퍼스트**: 터치 인터랙션 최적화

#### 백엔드
- **Node.js**: 이벤트 기반의 고성능 서버 런타임
- **Express.js**: 간단하고 유연한 웹 프레임워크
- **RESTful API**: 표준화된 데이터 통신
- **미들웨어 시스템**: CORS, JSON 파싱, 정적 파일 서빙

#### 데이터베이스
- **MySQL**: 관계형 데이터베이스로 사용자 데이터 안정적 관리
- **커넥션 풀링**: 동시 접속 최적화
- **스키마 설계**: 사용자, 관리자, 공지사항 테이블 구조화

#### 보안 및 인증
- **bcrypt**: 비밀번호 암호화로 보안 강화
- **세션 관리**: 클라이언트 상태 유지
- **입력 검증**: SQL 인젝션 및 XSS 방지

## 🖥️ 서버 설정

### 로컬 개발 환경
```bash
# 프로젝트 클론
git clone [repository-url]
cd AIAgentGame

# 의존성 설치
npm install

# 데이터베이스 설정 (XAMPP 권장)
# 1. XAMPP 설치 및 MySQL 시작
# 2. phpMyAdmin에서 'virtual_server' 데이터베이스 생성
# 3. database_schema.sql 실행

# 서버 실행
npm start
# 또는
node server.js
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

## 🌐 배포 및 호스팅

### 프론트엔드 (GitHub Pages)
- 정적 파일만 배포로 비용 절감
- CDN을 통한 글로벌 빠른 로딩
- HTTPS 자동 적용으로 보안 강화

### 백엔드 (개인 서버)
- Node.js Express 서버로 API 제공
- MySQL 데이터베이스 직접 관리
- 실시간 데이터 동기화 지원
- 확장성 있는 아키텍처 설계

## 📱 반응형 디자인

### 브레이크포인트 전략
- **데스크톱**: 1024px 이상 - 전체 기능 활용
- **태블릿**: 768px - 1024px - 터치 최적화
- **모바일**: 480px 이하 - 심플한 UI

### UX 최적화
- **터치 인터페이스**: 모바일 친화적 버튼 크기
- **자동 배경 전환**: 시각적 흥미 유발
- **모달 시스템**: 깔끔한 팝업 경험

## 🔧 개발자 경험

### 프로젝트 구조
```
AIAgentGame/
├── index.html          # 메인 사용자 페이지
├── admin.html          # 관리자 대시보드
├── server.js           # Express 서버
├── database_schema.sql # DB 스키마
├── package.json        # Node.js 설정
└── .env               # 환경 변수
```

### 코드 품질
- **모듈화**: 재사용 가능한 컴포넌트 설계
- **에러 핸들링**: 사용자 친화적 오류 메시지
- **성능 최적화**: 불필요한 리렌더링 방지
- **크로스 브라우저**: IE11+ 지원

## 🎯 앞으로의 계획

### 단기 목표
- [ ] 모바일 앱 개발 (React Native)
- [ ] 실시간 채팅 시스템 추가
- [ ] 게임 런쳐 프로토타입 개발

### 장기 비전
- [ ] 메타버스 월드 구현
- [ ] NFT 마켓플레이스 통합
- [ ] 크로스플랫폼 지원 확대

## 👨‍💻 기여 방법

프로젝트 개선에 관심 있으시면 언제든 환영합니다!

1. **이슈 생성**: 버그 리포트나 기능 제안
2. **풀 리퀘스트**: 코드 개선 제출
3. **토론 참여**: 커뮤니티 의견 공유

## 📄 라이선스

이 프로젝트는 MIT 라이선스로 배포됩니다. 자유로운 사용과 수정이 가능합니다.

---

**AIAgentGame** - 가상과 현실의 경계를 허무는 새로운 엔터테인먼트 플랫폼 🚀
