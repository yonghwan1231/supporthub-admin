import { subscribeTicketEvents } from "../_lib/ticket-events";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const encoder = new TextEncoder();

export async function GET(request: Request) {
  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      controller.enqueue(encoder.encode(": connected\n\n"));

      const unsubscribe = subscribeTicketEvents((chunk) => {
        if (closed) return;

        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          closed = true;
          unsubscribe();
        }
      });

      const heartbeatId = setInterval(() => {
        if (closed) return;

        controller.enqueue(encoder.encode(": heartbeat\n\n"));
      }, 30_000);

      request.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(heartbeatId);
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}
