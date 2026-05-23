export function createSseEventChunk({
  data,
  event,
}: {
  data: unknown;
  event: string;
}) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}
