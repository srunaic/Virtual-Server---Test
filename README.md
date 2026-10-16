버튼을 클릭해주세요

[**🎮 웹에서 스토리 체험하기**] (https://srunaic.github.io/Virtual-Server---Test/)    

[![천사냥이 방문](https://img.shields.io/badge/🌟_천사냥이_방문-수호수의_이야기-ff69b4?style=for-the-badge&logo=github&logoColor=white)](https://srunaic.github.io/Virtual-Server---Test/)

</div>
### 🌐 웹 API 구조
- `POST /api/register` - 사용자 등록
- `POST /api/login` - 사용자 인증
- `GET /api/story/progress` - 스토리 진행 상태
- `POST /api/choices` - 선택지 저장
- `GET /api/admin/stats` - 관리자 통계

### 🎮 Unity 주요 컴포넌트
- **Dialogue System**: 대화 및 선택지 관리
- **Character Controller**: 캐릭터 감정 표현
- **Scene Manager**: 씬 전환 및 배경 관리
- **Audio Manager**: BGM 및 효과음 제어
- **Save/Load System**: 게임 진행 상태 저장

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
### 개발 환경
```bash
# 웹 개발용
Node.js >= 18.0.0
npm >= 9.0.0

# Unity 개발용
Unity 2022.3+
Visual Studio 2022
Git >= 2.30

# 권장 도구
VS Code + Unity Extension
GitKraken (Git GUI)
Aseprite/Photoshop (일러스트)
Audacity (음향 편집)
```
