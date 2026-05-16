export interface CaptchaResponse {
  sessionId: string;
  question: string;
}

export interface CaptchaData {
  sessionId: string;
  answer: number;
  answerTimeMs?: number;
}