# Project Brief

## 컨셉

SupportHub Admin은 고객 문의를 처리하는 헬프데스크 어드민입니다. 문의 목록, 검색/필터, 페이지네이션, 상세 조회, 답변 작성, 첨부파일 업로드, 상태 변경, 일괄 처리, 삭제 확인 흐름을 제공합니다.

## 기술 스택

- Next.js App Router
- TypeScript
- MongoDB Atlas
- Next Route Handler 기반 API
- AWS S3 presigned URL 파일 업로드
- React Query
- React Hook Form
- Zod
- Tailwind CSS
- `@jyh-dev/kit`

## `@jyh-dev/kit` 적용 지점

- `createQueryService`: tickets API query/mutation 선언
- `useUrlState`: 검색어, 상태, 우선순위, 페이지, limit URL 동기화
- `usePagination`: 서버 페이지네이션 UI 계산
- `useSelection`: 테이블 체크박스 선택, 일괄 상태 변경
- `table-primitives`: 문의 목록 테이블
- `promise-modal`: 삭제/상태 변경/답변 전송 확인
- `useDraftForm`: 답변 작성 임시저장
- `useFile`: S3 presigned URL 기반 첨부파일 업로드
- `useAsyncAction`: 답변 저장, 일괄 처리 loading/error 흐름
- `useObjectState`: 필터/툴바 같은 객체 상태 관리

## 배포 확장

초기 MVP 이후 EC2 또는 ECS/App Runner 기반 AWS 배포와 GitHub Actions 자동 배포를 붙일 수 있게 `output: "standalone"`을 사용합니다.
