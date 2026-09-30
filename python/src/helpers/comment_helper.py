from src.clients.admin_comment_client import AdminCommentClient
from src.clients.comment_client import CommentClient
from src.helpers.captcha_helper import CaptchaHelper
from src.utils.generators import Generate
from src.utils.models import CommentDto, CommentStatus


def create_comment_list(
    photo_id: int,
    comment_client: CommentClient,
    captcha_helper: CaptchaHelper,
    admin_comment_client: AdminCommentClient | None = None,
    count: int = 3,
) -> list[CommentDto]:

    comment_list: list[CommentDto] = []

    for _ in range(count):
        captcha = captcha_helper.solve_captcha()
        comment = comment_client.create_in_isolation(Generate.comment_data(photo_id), captcha)
        if admin_comment_client is not None:
            admin_comment_client.moderate(comment.id, CommentStatus.APPROVED)
        comment_list.append(comment)
    return comment_list
