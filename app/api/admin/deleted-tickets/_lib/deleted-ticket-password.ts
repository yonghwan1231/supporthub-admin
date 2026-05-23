import { timingSafeEqual } from "crypto";

export function isDeletedTicketsPasswordValid(
  input: string | null,
  expected: string | undefined,
) {
  if (!input || !expected) return false;

  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  return (
    inputBuffer.length === expectedBuffer.length &&
    timingSafeEqual(inputBuffer, expectedBuffer)
  );
}
