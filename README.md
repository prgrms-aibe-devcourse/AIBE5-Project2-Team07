<div align="center">

# [대타] AIBE5 Project Team7

> 개인회원과 사업자회원을 연결하는 지역 기반 채용 매칭 플랫폼

</div>

개인회원은 공고를 검색/필터링한 뒤 지원하고, 사업자회원은 공고를 등록하고 지원자를 관리할 수 있는 O2O 채용 서비스입니다.

---

## 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [화면 구성](#화면-구성)
- [도메인 모델](#도메인-모델)
- [프로젝트 구조](#프로젝트-구조)
- [실행 방법](#실행-방법)
- [팀 소개](#팀-소개)
- [협업 규칙](#협업-규칙)

---

## 주요 기능

### 일반 사용자 (개인회원)
- 자체 회원가입/로그인, 소셜 로그인 기반 인증
- 지역/근무기간/근무요일/근무시간/업종 기반 공고 검색 및 필터링
- 공고 상세 조회, 스크랩, 온라인 지원/이메일 지원
- 마이페이지: 이력서 관리, 지원/제의 현황, 리뷰 작성

### 사업자회원
- 공고 등록/수정/삭제 및 첨부파일 업로드
- 지원자 수락/거절 및 근무 완료 처리
- 기업 정보/브랜드 정보 관리

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Backend | <img src="https://img.shields.io/badge/Spring_boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Springboot"/> <img src="https://img.shields.io/badge/Spring_Data_JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Springdatajpa"/> |
| Frontend | <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/> <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS"/> |
| DB | <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="mysql"/> |
| Auth | <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white" alt="Springsecurity"/> <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/> |
| Storage | <img src="https://img.shields.io/badge/Local_Uploads-4B5563?style=for-the-badge&logo=files&logoColor=white" alt="Local Uploads"/> |
| 지도/외부 API | <img src="https://img.shields.io/badge/Kakao_Map-FFCD00?style=for-the-badge&logo=kakao&logoColor=000" alt="Kakao Map"/> |

---

## 화면 구성

| 영역 | 화면 |
|------|------|
| 공통 | 메인, 로그인, 회원가입, 계정 관리 |
| 탐색 | 채용정보 목록, 공고 상세, 검색/필터 |
| 개인회원 | 온라인 지원, 지원 완료, 마이페이지(이력서/지원·제의/리뷰/스크랩) |
| 사업자회원 | 공고 등록/관리, 지원자 처리, 기업 정보 관리 |

---

## 도메인 모델

| Entity | 설명 |
|--------|------|
| `Member` | 회원 기본 정보 (개인/사업자 타입 포함) |
| `BusinessProfile` | 사업자 프로필/기업 정보 |
| `Recruit` | 채용 공고 (급여, 근무조건, 지역, 마감일, 상태) |
| `Apply` | 지원/제의 엔티티 (`PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`) |
| `Resume` | 개인회원 이력서 |
| `Review` | 근무 후기 및 평점 |
| `Region` | 지역 정보 |
| `ScrapRecruit` | 공고 스크랩 정보 |

---

## 프로젝트 구조

```text
frontend/
├── src/
│   ├── components/        # 공통/도메인 UI 컴포넌트
│   ├── pages/             # 라우트 페이지 (Main, RecruitDetail, MyPage 등)
│   ├── services/          # API 호출 모듈
│   ├── hooks/             # 커스텀 훅
│   ├── utils/             # 공통 유틸
│   └── constants/         # 상수/라벨 매핑
└── public/                # 정적 리소스

src/main/
├── java/com/example/aibe5_project2_team7/
│   ├── recruit/           # 공고 도메인
│   ├── apply/             # 지원/제의 도메인
│   ├── member/            # 회원 도메인
│   ├── review/            # 리뷰 도메인
│   └── file/              # 파일 업로드 도메인
└── resources/
    ├── application*.properties
    └── static/
```

---

## 실행 방법

### 사전 요구사항
- Java 17
- Node.js 18+
- MySQL 8.x

### 환경 변수 설정

`src/main/resources/application.properties` 또는 별도 profile에 DB/JWT/외부 API 설정이 필요합니다.

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/YOUR_DB
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

# JWT
jwt.secret=YOUR_JWT_SECRET

# Kakao/외부 API (사용 시)
kakao.rest-api-key=YOUR_KAKAO_KEY
```

### 빌드 및 실행

```bash
# backend (프로젝트 루트)
./gradlew bootRun

# frontend
cd frontend
npm install
npm run dev
```

기본 포트:
- Backend: `8080`
- Frontend (Vite): `5173`

---

## 팀 소개

<div align="center">

### Team 7

<table>
<tr>
<td align="center">
<a href="https://github.com/0cha-0cha"><img src="https://github.com/0cha-0cha.png" width="100px;" alt="손주현"/></a><br />
<sub><b>손주현</b></sub><br />
<sub>팀장 / BE, FE</sub>
</td>
<td align="center">
<a href="https://github.com/minguk0825"><img src="https://github.com/minguk0825.png" width="100px;" alt="김민국"/></a><br />
<sub><b>김민국</b></sub><br />
<sub>BE, FE</sub>
</td>
<td align="center">
<a href="https://github.com/congsoony"><img src="https://github.com/congsoony.png" width="100px;" alt="이재섭"/></a><br />
<sub><b>이재섭</b></sub><br />
<sub>BE, FE</sub>
</td>
<td align="center">
<a href="https://github.com/jwh039"><img src="https://github.com/jwh039.png" width="100px;" alt="전우현"/></a><br />
<sub><b>전우현</b></sub><br />
<sub>BE, FE</sub>
</td>
</tr>
</table>

</div>

---

## 협업 규칙

### Branch Naming

| 접두사 | 용도 | 예시 |
|--------|------|------|
| `feature/` | 새로운 기능 개발 | `feature/#12-recruit-filter` |
| `fix/` | 버그 수정 | `fix/#15-urgent-filter` |
| `hotfix/` | 긴급 버그 수정 (프로덕션) | `hotfix/#20-login-critical` |

```bash
# 브랜치 생성 예시
git checkout -b feature/#12-recruit-filter
git checkout -b fix/#15-mypage-status
```

### Commit Message

| 타입 | 용도 | 예시 |
|------|------|------|
| `[Feat]` | 새로운 기능 추가 | `[Feat] #12 - 공고 필터 UI 추가` |
| `[Fix]` | 버그 수정 | `[Fix] #15 - 급구 필터 파라미터 보정` |
| `[Chore]` | 빌드/설정/의존성 변경 | `[Chore] #18 - ESLint 설정 업데이트` |
| `[Refactor]` | 코드 리팩토링 | `[Refactor] #20 - apply 상태 처리 분리` |
| `[Docs]` | 문서 수정 | `[Docs] #22 - README 개선` |
| `[Style]` | 코드 포맷팅/스타일 수정 | `[Style] #25 - 들여쓰기 정리` |
| `[Test]` | 테스트 코드 추가/수정 | `[Test] #28 - recruit 필터 테스트 추가` |

```bash
# 커밋 메시지 예시
git commit -m "[Feat] #12 - 공고 상세 페이지 구현"
git commit -m "[Fix] #15 - 급구 공고 조회 버그 수정"
git commit -m "[Chore] #18 - Vite 의존성 업데이트"
```

### PR Template

```markdown
## What
- 작업 내용을 간단히 설명해주세요

## Issue
- Closes: #이슈번호

## Checklist
- [ ] 브랜치 base가 적절한가요?
- [ ] PR 제목이 이슈 제목과 유사한가요?
- [ ] 최소 1명의 리뷰를 받았나요?
```