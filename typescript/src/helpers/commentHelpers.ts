import { type CommentClient } from '#clients/CommentClient';
import { type CaptchaHelper } from '#helpers/CaptchaHelper';
import { type AdminCommentClient } from '#clients/AdminCommentClient';
import { CommentStatusSchema, type CommentDto } from '#utils/schemas';
import { generate } from '#utils/generators';

export async function createCommentList(
  photoId: number,
  commentClient: CommentClient,
  captchaHelper: CaptchaHelper,
  count = 3,
  adminCommentClient?: AdminCommentClient,
): Promise<CommentDto[]> {
  const commentList: CommentDto[] = [];

  for (let i = 0; i < count; i++) {
    const captcha = await captchaHelper.solveCaptcha();

    const comment = await commentClient.createInIsolation(generate.commentData(photoId), captcha);

    if (adminCommentClient) {
      await adminCommentClient.moderate(comment.id, CommentStatusSchema.enum.APPROVED);
    }
    commentList.push(comment);
  }

  return commentList;
}
