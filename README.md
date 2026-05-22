# SupportHub Admin

`@jyh-dev/kit`을 실제 서비스형 흐름에 적용하기 위한 고객문의 헬프데스크 어드민입니다.

## 목표

- Next.js App Router와 Route Handler로 프론트/서버 API를 한 프로젝트 안에서 구성합니다.
- MongoDB Atlas에 문의, 답변, 첨부파일 메타데이터를 저장합니다.
- AWS S3 presigned URL로 브라우저 직접 업로드 흐름을 구현합니다.
- `@jyh-dev/kit`의 query service, URL state, pagination, selection, table, modal, draft form, file upload, async action, object state를 실제 화면에 적용합니다.

## 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 주요 환경변수

- `MONGODB_URI`: MongoDB Atlas connection string
- `MONGODB_DB_NAME`: 사용할 DB 이름
- `AWS_REGION`: S3 버킷 리전
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`: presigned URL 발급용 IAM key
- `S3_BUCKET_NAME`: 업로드 대상 버킷
- `S3_PUBLIC_BASE_URL`: CloudFront 또는 public bucket base URL. 없으면 S3 기본 URL을 사용합니다.

## 옮기는 방법

이 폴더는 독립 Next 프로젝트라서 `apps/supporthub-admin` 폴더만 바깥으로 옮기면 됩니다.

```bash
mv apps/supporthub-admin ../supporthub-admin
cd ../supporthub-admin
npm install
```

옮긴 뒤 GitHub 새 레포로 초기화하면 됩니다.
