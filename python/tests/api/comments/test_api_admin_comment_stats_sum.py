import allure
import pytest

from src.clients.admin_comment_client import AdminCommentClient


@pytest.mark.api
@allure.title("Верификация баланса метрик: сумма статусов комментариев равна общему количеству")
def test_api_admin_comment_stats_sum(admin_comment_client: AdminCommentClient) -> None:
    stats = admin_comment_client.get_stats()
    assert stats.total == stats.pending + stats.approved + stats.rejected
