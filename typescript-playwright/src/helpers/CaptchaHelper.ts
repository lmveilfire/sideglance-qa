import type { APIRequestContext } from '@playwright/test';
import { CommentApi } from '../api/CommentApi.ts';
import type {CaptchaResponse, CaptchaData} from '../utils/interfaces.ts';

export class CaptchaHelper {
  private readonly commentApi: CommentApi;

  constructor(request: APIRequestContext) {
    this.commentApi = new CommentApi(request);
  }

  async solveCaptcha(): Promise<CaptchaData> {
    const response = await this.commentApi.getCaptcha();
    const captcha: CaptchaResponse = await response.json();
    const answer = this.solve(captcha.question);
    return { sessionId: captcha.sessionId, answer };
  }

  private solve(question: string): number {
    const numbers: Record<string, number> = {
      'ноль': 0, 'один': 1, 'два': 2, 'три': 3, 'четыре': 4,
      'пять': 5, 'шесть': 6, 'семь': 7, 'восемь': 8, 'девять': 9,
      'десять': 10, 'одиннадцать': 11, 'двенадцать': 12,
      'тринадцать': 13, 'четырнадцать': 14, 'пятнадцать': 15,
      'шестнадцать': 16, 'семнадцать': 17, 'восемнадцать': 18, 'девятнадцать': 19,
      'двадцать': 20,
    };

    const q = question.toLowerCase().replace('?', '').replace('сколько будет ', '');
    const words = q.split(' ');
    const a = numbers[words[0] ?? ''] ?? 0;
    const op = words[1];
    const b = numbers[words[words.length - 1] ?? ''] ?? 0;

    if (op === 'плюс') return a + b;
    if (op === 'минус') return a - b;
    if (op === 'умножить') return a * b;

    throw new Error(`[CaptchaHelper] неизвестный оператор: "${op}" в вопросе: "${question}"`);
  }
}