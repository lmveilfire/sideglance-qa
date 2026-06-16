export function statusIn(...codes: number[]): (status: number) => boolean {
  return (status) => codes.includes(status);
}
