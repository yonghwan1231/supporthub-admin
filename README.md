# SupportHub Admin

**Live Demo:** [supporthub-admin.vercel.app](https://supporthub-admin.vercel.app/)

`@jyh-dev/kit`을 실제 관리자 콘솔 흐름에 적용해보기 위해 만든 고객문의 헬프데스크 샘플입니다.

문의 목록, 검색/필터, 페이지네이션, 상세 조회, 답변 작성, 첨부파일 업로드, 상태 변경, 일괄 처리, 삭제된 문의 보관, 대시보드, 긴급 문의 알림 흐름에 적용해 보았습니다.

## 개요

이 프로젝트의 목적은 단순한 CRUD 예제가 아닌 직접 만든 라이브러리 `@jyh-dev/kit`이 실제 개발에서 사용감이 어떤지 확인하는 것입니다.

라이브러리 레포에서 API를 설계하고 문서화하는 것만으로는 사용감이 잘 드러나지 않기 때문에 어드민 개발에서의 패턴을 기준으로 샘플 앱을 구성했습니다.

- 검색/필터 상태 URL 동기화
- Tanstack Query 기반 API 선언 + invalidation
- 테이블 체크박스 일괄 처리
- Promise 기반 확인/입력 모달
- 답변 임시저장
- S3 presigned URL 파일 업로드
- SSE 기반 긴급 알림

## 주요 기능

- 고객 문의 목록 조회
- 상태, 우선순위, 키워드 필터
- URL query string 기반 검색 상태 복원
- 페이지네이션
- 테이블 체크박스 선택과 일괄 상태 변경
- 문의 생성 모달
- 문의 상세 조회
- 답변 작성과 임시저장
- 첨부파일 업로드와 다운로드
- 문의 삭제와 삭제된 문의 별도 보관
- 관리자 비밀번호 기반 삭제된 문의 접근
- seed 데이터 초기화
- 대시보드 지표와 차트
- 긴급 문의 생성 시 SSE 알림
- Storybook 기반 UI 컴포넌트 확인

## 기술 스택

- Next.js App Router
- TypeScript
- MongoDB Atlas
- Next Route Handler API
- AWS S3 presigned URL
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- Zustand
- Recharts
- Storybook
- Sentry
- `@jyh-dev/kit`

## `@jyh-dev/kit` 적용 지점

| 기능                             | 사용 위치                                                |
| -------------------------------- | -------------------------------------------------------- |
| `createQueryService`             | ticket, deleted ticket, dashboard API service 선언       |
| `createUrlState` / `useUrlState` | 문의 목록 필터와 페이지 상태를 URL query string과 동기화 |
| `useSelection`                   | 문의 목록 체크박스 선택과 일괄 상태 변경                 |
| `usePagination`                  | 목록 페이지네이션 계산                                   |
| `promise-modal`                  | 확인, 입력, 문의 생성 커스텀 모달                        |
| `ModalFrame`                     | 커스텀 모달의 공통 프레임                                |
| `useFileUploader`                | S3 presigned URL 기반 첨부파일 업로드                    |
| `useDraftForm`                   | 답변 작성 내용 localStorage 임시저장                     |
| `useAsyncAction`                 | 답변 등록 같은 비동기 액션 상태 관리                     |
| `useObjectState`                 | 필터 draft, 일괄 처리 toolbar 상태 관리                  |
| `table-primitives`               | 문의 목록과 삭제된 문의 목록 테이블                      |
| `realtime` / `useSse`            | 긴급 문의 알림 이벤트 구독                               |

## 구조

```txt
app/
  api/                  Next Route Handler API
  dashboard/            대시보드 라우트
  tickets/              문의 목록/상세 라우트
  deleted-tickets/      삭제된 문의 라우트

src/
  common/               공통 UI, layout, provider, modal, api client
  dashboard/            대시보드 화면, 서비스, 타입
  tickets/              문의 화면, 컴포넌트, 서비스, 스키마
  deleted-tickets/      삭제된 문의 화면, 서비스, 접근 상태
```

백엔드에서만 쓰는 로직은 가능한 `app/api` 아래에 두고, 프론트와 백엔드가 같이 쓰는 타입/스키마만 `src`에서 공유합니다.

## 실행

```bash
npm install
npm run dev
```

## 환경변수

```env
MONGODB_URI=
MONGODB_DB_NAME=supporthub

AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=supporthub-uploads-yhjung-2026
S3_PUBLIC_BASE_URL=

SUPPORTHUB_RESET_PASSWORD=
```

## 구현 후기

### `createQueryService`의 장단점

`createQueryService`는 API 함수, React Query hook, query key, mutation invalidation을 한 곳에서 정의할 수 있게 만들었습니다. 서비스 단위로 API 사용 흐름이 모이고, query key를 직접 문자열로 관리하지 않아도 된다는 장점이 있습니다.

다만 기존 Tanstack Query 사용 방식이나 일반적인 API 함수 선언 방식과 문법이 달라집니다. 처음 보는 사람 입장에서는 `queries.useGetTickets`, `mutations.useBulkUpdateStatus`, `keys.list.getItems()` 같은 패턴을 새로 익혀야 하므로 학습 비용이 늘어날 수 있습니다.

이 부분은 아직 개선 여지가 있습니다. 특히 문서와 예제가 충분하지 않으면 오히려 추상화가 코드를 읽기 어렵게 만들 수 있기 때문에, 라이브러리 쪽에서는 API 이름, 타입 추론, invalidation 작성 방식, playground 예제를 계속 다듬어야 합니다.

## 참고

이 프로젝트는 `@jyh-dev/kit`의 사용감을 확인하기 위한 샘플 성격이 강합니다. 실서비스 수준으로 확장한다면 인증/권한, 감사 로그, rate limit, 파일 보안 정책, Sentry 알림 정책, 배포 환경별 설정 검증 등을 더 보강해야 합니다.
