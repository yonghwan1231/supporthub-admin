const now = new Date();

const minutesAgo = (minutes: number) =>
  new Date(now.getTime() - minutes * 60 * 1000).toISOString();

export const seedTickets: Array<Omit<$Ticket.Item, "id">> = [
  {
    title: "Receipt reissue request",
    content:
      "I need the receipt for last month's subscription payment for company reimbursement.",
    customerName: "Minji Kim",
    customerEmail: "minji@example.com",
    status: "open",
    priority: "medium",
    priorityWeight: 2,
    category: "billing",
    tags: ["billing", "receipt"],
    attachments: [],
    replies: [],
    createdAt: minutesAgo(45),
    updatedAt: minutesAgo(45),
  },
  {
    title: "Dashboard is empty after login",
    content:
      "I can sign in successfully, but no projects are displayed on the dashboard.",
    customerName: "Junho Park",
    customerEmail: "junho@example.com",
    status: "in_progress",
    priority: "high",
    priorityWeight: 3,
    category: "technical",
    tags: ["login", "dashboard"],
    attachments: [],
    replies: [
      {
        id: "reply-seed-1",
        authorName: "Support",
        message:
          "We are checking the account permission and project connection status.",
        attachments: [],
        createdAt: minutesAgo(25),
      },
    ],
    createdAt: minutesAgo(80),
    updatedAt: minutesAgo(25),
  },
  {
    title: "Attachment upload keeps failing",
    content: "Uploading a PDF file fails. The file size is about 8MB.",
    customerName: "Seoyeon Lee",
    customerEmail: "seoyeon@example.com",
    status: "open",
    priority: "urgent",
    priorityWeight: 4,
    category: "technical",
    tags: ["file", "upload", "s3"],
    attachments: [],
    replies: [],
    createdAt: minutesAgo(120),
    updatedAt: minutesAgo(120),
  },
  {
    title: "Invitation email was not delivered",
    content:
      "I invited a team member from the admin page, but they did not receive the email.",
    customerName: "Yujin Choi",
    customerEmail: "yujin@example.com",
    status: "hold",
    priority: "low",
    priorityWeight: 1,
    category: "account",
    tags: ["team", "invite", "email"],
    attachments: [],
    replies: [
      {
        id: "reply-seed-2",
        authorName: "Support",
        message:
          "We are checking the email delivery log. Please also check the spam folder.",
        attachments: [],
        createdAt: minutesAgo(180),
      },
    ],
    createdAt: minutesAgo(240),
    updatedAt: minutesAgo(180),
  },
  {
    title: "How do I start using the service?",
    content:
      "I would like to know the basic flow for creating a project and inviting members.",
    customerName: "Daeun Jung",
    customerEmail: "daeun@example.com",
    status: "resolved",
    priority: "medium",
    priorityWeight: 2,
    category: "general",
    tags: ["guide", "onboarding"],
    attachments: [],
    replies: [
      {
        id: "reply-seed-3",
        authorName: "Support",
        message: "We sent the project creation and member invitation guide.",
        attachments: [],
        createdAt: minutesAgo(320),
      },
    ],
    createdAt: minutesAgo(420),
    updatedAt: minutesAgo(320),
  },
];
