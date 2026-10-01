import type { APIRequestContext } from '@playwright/test';
import { CommentApi } from '#api/CommentApi';
import { CaptchaResponseSchema, type CaptchaData } from '#utils/schemas';
import { assertStatus } from '#utils/apiHelpers';
import { DEFAULT_ANSWER_TIME_MS, HTTP } from '#utils/constants';
import { step } from '#utils/decorators';

const NUMBER_WORDS: Record<string, number> = {
  ноль: 0,
  один: 1,
  два: 2,
  три: 3,
  четыре: 4,
  пять: 5,
  шесть: 6,
  семь: 7,
  восемь: 8,
  девять: 9,
  десять: 10,
  одиннадцать: 11,
  двенадцать: 12,
  тринадцать: 13,
  четырнадцать: 14,
  пятнадцать: 15,
  шестнадцать: 16,
  семнадцать: 17,
  восемнадцать: 18,
  девятнадцать: 19,
  двадцать: 20,
};

export class CaptchaHelper {
  private readonly commentApi: CommentApi;

  constructor(request: APIRequestContext) {
    this.commentApi = new CommentApi(request);
  }

  @step
  async solveCaptcha(answerTimeMs = DEFAULT_ANSWER_TIME_MS): Promise<CaptchaData> {
    const response = await this.commentApi.getCaptcha();
    await assertStatus(response, 'CaptchaHelper.solveCaptcha', HTTP.OK);
    const captcha = CaptchaResponseSchema.parse(await response.json());
    return {
      sessionId: captcha.sessionId,
      answer: this.solve(captcha.question),
      answerTimeMs,
    };
  }

  private toNumber(word: string | undefined, question: string): number {
    const value = NUMBER_WORDS[word ?? ''];
    if (value === undefined) {
      throw new Error(`[CaptchaHelper] неизвестное число "${word}" в вопросе: "${question}"`);
    }
    return value;
  }

  private solve(question: string): number {
    const q = question.toLowerCase().replace('?', '').replace('сколько будет ', '').trim();
    const words = q.split(' ');
    const a = this.toNumber(words[0], question);
    const op = words[1];
    const b = this.toNumber(words[words.length - 1], question);

    if (op === 'плюс') return a + b;
    if (op === 'минус') return a - b;
    if (op === 'умножить') return a * b;

    throw new Error(`[CaptchaHelper] неизвестный оператор: "${op}" в вопросе: "${question}"`);
  }
}
