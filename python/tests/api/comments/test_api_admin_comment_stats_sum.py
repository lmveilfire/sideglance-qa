import allure
import pytest

from src.clients.admin_comment_client import AdminCommentClient


@pytest.mark.api
@allure.title("Комментарии: валидация суммы статусов комментариев в статистике")
def test_api_admin_comment_stats_sum(admin_comment_client: AdminCommentClient) -> None:
    stats = admin_comment_client.get_stats()
    assert stats.total == stats.pending + stats.approved + stats.rejected
