from src.clients.comment_client import CommentClient
from src.helpers.captcha_helper import CaptchaHelper
from src.utils.generators import Generate
from src.utils.models import CommentDto


def create_comment_list(
    photo_id: int, comment_client: CommentClient, captcha_helper: CaptchaHelper, count: int = 3
) -> list[CommentDto]:

    comment_list: list[CommentDto] = []

    for _ in range(count):
        captcha = captcha_helper.solve_captcha()
        comment = comment_client.create_in_isolation(Generate.comment_data(photo_id), captcha)
        comment_list.append(comment)
    return comment_list
