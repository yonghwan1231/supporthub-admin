const now = new Date();

const minutesAgo = (minutes: number) =>
  new Date(now.getTime() - minutes * 60 * 1000).toISOString();

export const seedTickets: Array<Omit<$Ticket.Item, "id">> = [
  {
    title: "지난달 결제 영수증 재발급 요청",
    content:
      "회사 비용 처리에 필요해서 지난달 스탠다드 요금제 결제 영수증을 다시 받을 수 있을까요?",
    customerName: "김민지",
    customerEmail: "minji.kim@hanbitworks.co.kr",
    status: "open",
    priority: "medium",
    priorityWeight: 2,
    category: "billing",
    tags: ["결제", "영수증", "증빙"],
    attachments: [],
    replies: [],
    createdAt: minutesAgo(45),
    updatedAt: minutesAgo(45),
  },
  {
    title: "로그인 후 티켓 목록이 비어 보입니다",
    content:
      "관리자 계정으로 로그인은 되는데 어제까지 보이던 고객 문의 목록이 전부 사라진 것처럼 표시됩니다.",
    customerName: "박준호",
    customerEmail: "junho.park@northstar.io",
    status: "in_progress",
    priority: "high",
    priorityWeight: 3,
    category: "technical",
    tags: ["로그인", "목록", "권한"],
    attachments: [],
    replies: [
      {
        id: "reply-seed-1",
        authorName: "지원팀",
        message:
          "계정 권한과 워크스페이스 연결 상태를 확인하고 있습니다. 같은 조직의 다른 관리자 계정에서는 목록이 보이는지도 함께 확인 부탁드립니다.",
        attachments: [],
        createdAt: minutesAgo(25),
      },
    ],
    createdAt: minutesAgo(80),
    updatedAt: minutesAgo(25),
  },
  {
    title: "첨부파일 업로드가 403 오류로 실패합니다",
    content:
      "PDF 견적서를 첨부하려고 하면 업로드가 끝나기 직전에 403 오류가 납니다. 파일 용량은 약 8MB입니다.",
    customerName: "이서연",
    customerEmail: "seoyeon.lee@bluecart.kr",
    status: "open",
    priority: "urgent",
    priorityWeight: 4,
    category: "technical",
    tags: ["파일", "업로드", "S3", "403"],
    attachments: [],
    replies: [],
    createdAt: minutesAgo(120),
    updatedAt: minutesAgo(120),
  },
  {
    title: "관리자 초대 메일이 도착하지 않습니다",
    content:
      "팀원에게 관리자 초대 메일을 보냈는데 받은 편지함과 스팸함 어디에도 보이지 않는다고 합니다.",
    customerName: "최유진",
    customerEmail: "yujin.choi@makerslab.co.kr",
    status: "hold",
    priority: "low",
    priorityWeight: 1,
    category: "account",
    tags: ["팀원", "초대", "이메일"],
    attachments: [],
    replies: [
      {
        id: "reply-seed-2",
        authorName: "지원팀",
        message:
          "발송 로그를 확인하는 동안 수신자 도메인에서 외부 초대 메일을 차단하고 있는지도 확인 부탁드립니다.",
        attachments: [],
        createdAt: minutesAgo(180),
      },
    ],
    createdAt: minutesAgo(240),
    updatedAt: minutesAgo(180),
  },
  {
    title: "서비스 도입 전에 보안 자료를 받을 수 있을까요?",
    content:
      "내부 검토용으로 개인정보 처리 방식, 접근 권한 관리, 데이터 보관 정책이 정리된 자료가 필요합니다.",
    customerName: "정다은",
    customerEmail: "daeun.jung@orbitcare.co.kr",
    status: "hold",
    priority: "medium",
    priorityWeight: 2,
    category: "general",
    tags: ["보안", "도입검토", "자료요청"],
    attachments: [],
    replies: [
      {
        id: "reply-seed-3",
        authorName: "지원팀",
        message:
          "보안 체크리스트와 데이터 처리 안내 문서를 전달드릴 예정입니다. 필요하신 양식이 있으면 함께 보내주세요.",
        attachments: [],
        createdAt: minutesAgo(320),
      },
    ],
    createdAt: minutesAgo(420),
    updatedAt: minutesAgo(320),
  },
  {
    title: "결제 카드 변경 화면에서 본인인증이 반복됩니다",
    content:
      "카드를 바꾸려고 본인인증을 완료했는데 다시 인증 화면으로 돌아갑니다. 크롬과 엣지에서 모두 재현됩니다.",
    customerName: "한지훈",
    customerEmail: "jihoon.han@marketbridge.kr",
    status: "in_progress",
    priority: "urgent",
    priorityWeight: 4,
    category: "billing",
    tags: ["결제수단", "본인인증", "반복"],
    attachments: [],
    replies: [
      {
        id: "reply-seed-4",
        authorName: "지원팀",
        message:
          "결제 인증 세션이 만료되는 지점을 확인 중입니다. 문제가 발생한 시간대와 카드사명을 알려주시면 추적에 도움이 됩니다.",
        attachments: [],
        createdAt: minutesAgo(510),
      },
    ],
    createdAt: minutesAgo(560),
    updatedAt: minutesAgo(510),
  },
  {
    title: "답변 작성 중 임시저장이 사라졌습니다",
    content:
      "긴 답변을 작성하다가 새로고침 후 복원 안내가 떠서 눌렀는데 내용이 비어 있었습니다.",
    customerName: "오세빈",
    customerEmail: "sebin.oh@steadyops.io",
    status: "open",
    priority: "high",
    priorityWeight: 3,
    category: "technical",
    tags: ["임시저장", "답변", "새로고침"],
    attachments: [],
    replies: [],
    createdAt: minutesAgo(720),
    updatedAt: minutesAgo(720),
  },
  {
    title: "팀 멤버 권한을 읽기 전용으로 제한하고 싶습니다",
    content:
      "외부 파트너에게 문의 현황만 공유해야 해서 답변 작성이나 상태 변경은 막고 싶습니다.",
    customerName: "문하린",
    customerEmail: "harin.moon@clearwave.kr",
    status: "open",
    priority: "medium",
    priorityWeight: 2,
    category: "account",
    tags: ["권한", "팀관리", "읽기전용"],
    attachments: [],
    replies: [],
    createdAt: minutesAgo(900),
    updatedAt: minutesAgo(900),
  },
  {
    title: "요금제 변경 후 사용량 한도가 그대로 표시됩니다",
    content:
      "프로 요금제로 업그레이드했는데 대시보드에는 아직 이전 한도가 표시됩니다. 실제 제한도 그대로인지 확인 부탁드립니다.",
    customerName: "강태오",
    customerEmail: "taeo.kang@nextplate.co.kr",
    status: "resolved",
    priority: "medium",
    priorityWeight: 2,
    category: "billing",
    tags: ["요금제", "사용량", "동기화"],
    attachments: [],
    replies: [
      {
        id: "reply-seed-5",
        authorName: "지원팀",
        message:
          "결제 승인 후 사용량 캐시가 갱신되지 않은 것으로 확인되어 수동 동기화했습니다. 현재 프로 요금제 한도로 반영되었습니다.",
        attachments: [],
        createdAt: minutesAgo(1080),
      },
    ],
    createdAt: minutesAgo(1260),
    updatedAt: minutesAgo(1080),
  },
  {
    title: "상담 이관 내역을 CSV로 내려받을 수 있나요?",
    content:
      "월간 운영 리포트에 상담 이관 건수를 넣어야 해서 기간별 CSV 다운로드가 가능한지 문의드립니다.",
    customerName: "배수아",
    customerEmail: "sua.bae@withgarden.kr",
    status: "resolved",
    priority: "low",
    priorityWeight: 1,
    category: "general",
    tags: ["리포트", "CSV", "이관"],
    attachments: [],
    replies: [
      {
        id: "reply-seed-6",
        authorName: "지원팀",
        message:
          "현재는 관리자 화면의 필터 결과를 기준으로 CSV 다운로드를 제공하고 있습니다. 리포트 메뉴의 내보내기 버튼을 이용해주세요.",
        attachments: [],
        createdAt: minutesAgo(1440),
      },
    ],
    createdAt: minutesAgo(1680),
    updatedAt: minutesAgo(1440),
  },
  {
    title: "삭제한 문의를 복구할 수 있나요?",
    content:
      "테스트 중 실수로 실제 고객 문의를 삭제했습니다. 답변 내역까지 복구할 수 있는지 확인 부탁드립니다.",
    customerName: "임채원",
    customerEmail: "chaewon.lim@finecrew.io",
    status: "resolved",
    priority: "low",
    priorityWeight: 1,
    category: "general",
    tags: ["삭제", "복구", "운영"],
    attachments: [],
    replies: [
      {
        id: "reply-seed-7",
        authorName: "지원팀",
        message:
          "삭제된 문의는 운영 백업에서 복구했습니다. 같은 문제가 반복되지 않도록 삭제 확인 문구를 강화할 예정입니다.",
        attachments: [],
        createdAt: minutesAgo(2040),
      },
    ],
    createdAt: minutesAgo(2280),
    updatedAt: minutesAgo(2040),
  },
  {
    title: "SAML 로그인 연동 가능 여부가 궁금합니다",
    content:
      "사내 계정 체계가 Google Workspace SSO로 통합되어 있어서 SupportHub도 SAML 로그인을 붙일 수 있는지 알고 싶습니다.",
    customerName: "서민규",
    customerEmail: "mingyu.seo@oneteam.dev",
    status: "open",
    priority: "high",
    priorityWeight: 3,
    category: "account",
    tags: ["SSO", "SAML", "계정연동"],
    attachments: [],
    replies: [],
    createdAt: minutesAgo(2880),
    updatedAt: minutesAgo(2880),
  },
];
