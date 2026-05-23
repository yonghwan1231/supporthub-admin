import assert from "node:assert/strict";
import { createSseEventChunk } from "../app/api/realtime/_lib/sse-format.ts";

const chunk = createSseEventChunk({
  data: {
    id: "ticket-1",
    title: "긴급 문의",
  },
  event: "ticket.urgent",
});

assert.equal(
  chunk,
  'event: ticket.urgent\ndata: {"id":"ticket-1","title":"긴급 문의"}\n\n',
);
