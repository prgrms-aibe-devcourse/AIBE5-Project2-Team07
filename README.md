### Branch Naming

| 접두사     | 용도                      | 예시                        |
| ---------- | ------------------------- | --------------------------- |
| `feature/` | 새로운 기능 개발          | `feature/#12-login-page`    |
| `fix/`     | 버그 수정                 | `fix/#15-auth-redirect`     |
| `hotfix/`  | 긴급 버그 수정 (프로덕션) | `hotfix/#20-critical-crash` |

```bash
# 브랜치 생성 예시
git checkout -b feature/#12-trip-create
git checkout -b fix/#15-map-loading-error
```

### Commit Message

| 타입         | 용도                  | 예시                                      |
| ------------ | --------------------- | ----------------------------------------- |
| `[Feat]`     | 새로운 기능 추가      | `[Feat] #12 - 여행 생성 폼 추가`          |
| `[Fix]`      | 버그 수정             | `[Fix] #15 - 로그인 리다이렉트 오류 수정` |
| `[Chore]`    | 빌드, 설정, 의존성 등 | `[Chore] #18 - eslint 설정 업데이트`      |
| `[Refactor]` | 코드 리팩토링         | `[Refactor] #20 - useAuth 훅 분리`        |
| `[Docs]`     | 문서 수정             | `[Docs] #22 - README 업데이트`            |
| `[Style]`    | 코드 포맷팅           | `[Style] #25 - 들여쓰기 수정`             |
| `[Test]`     | 테스트 코드           | `[Test] #28 - 로그인 테스트 추가`         |

```bash
# 커밋 메시지 예시
git commit -m "[Feat] #12 - 여행 상세 페이지 구현"
git commit -m "[Fix] #15 - 지도 마커 클릭 이벤트 수정"
git commit -m "[Chore] #18 - React Bootstrap 버전 업그레이드"
```

### Issue Templates

GitHub에서 "New Issue" 클릭 시 템플릿 선택 화면이 표시됩니다.

| 템플릿      | 용도                              | 라벨          |
| ----------- | --------------------------------- | ------------- |
| **Epic**    | 대규모 기능 단위 (여러 이슈 포함) | `epic`        |
| **Feature** | 단일 기능 구현                    | `enhancement` |
| **Bug**     | 버그 리포트                       | `bug`         |



### PR Template

```markdown
## 🔎 What

- 한 작업을 간단히 설명해주세요

## 🔗 Issue

- Closes: #이슈번호

## ✅ 체크리스트

- [ ] 브랜치 base가 적절한가요?
- [ ] 제목이 이슈 제목과 동일한가요?
- [ ] 최소 1명의 리뷰를 받았나요?
```