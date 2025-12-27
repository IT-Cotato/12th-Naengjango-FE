# 냉잔고 프론트엔드 개발 컨벤션

## 📌 Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS

## 🧭 깃 브랜치 전략

- main 브랜치 : 배포용 브랜치
- dev 브랜치 : 개발용 브랜치

### 브랜치 명명 규칙

- `type/description` 형식
  | type | description |
  |------|-------------|
  | `feat` | 새로운 기능 추가 |
  | `fix` | 버그 수정 |
  | `refactor` | 리팩토링 (기능 변경 없음) |
  | `chore` | 설정, 빌드, 환경 작업 |
  | `docs` | 문서 작업 |
  | `style` | 코드 스타일 변경 |
  **예시**
- `feat/login`
- `feat/router-setup`
- `fix/header-bug`
- `refactor/api-structure`
- `chore/eslint-prettier`
- `docs/readme`

### 커밋 메시지 규칙

- `type: description` 형식

| type       | description           |
| ---------- | --------------------- |
| `feat`     | 새로운 기능 추가      |
| `fix`      | 버그 수정             |
| `refactor` | 리팩토링              |
| `chore`    | 설정, 빌드, 환경 작업 |
| `docs`     | 문서 작업             |
| `style`    | 코드 스타일 변경      |

**예시**

- `feat: add login page`
- `feat: setup router structure`
- `fix: resolve header layout issue`
- `refactor: simplify api logic`
- `chore: setup eslint and prettier`
- `docs: update readme`
