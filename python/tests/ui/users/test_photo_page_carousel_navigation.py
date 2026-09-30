import allure
import pytest
from playwright.async_api import expect

from src.helpers.photo_helpers import create_photo_list
from src.utils.generators import Generate


@pytest.mark.ui
@allure.title("Навигация между фотографиями в карусели на странице просмотра")
async def test_photo_page_carousel_navigation(
    category_client,
    photo_client,
    photo_page,
) -> None:

    category = category_client.create(Generate.category_data().name)

    photo_old, photo_new = create_photo_list(category.id, photo_client, 2)
    await photo_page.open(photo_new.id)

    await expect(photo_page.carousel_prev_btn).to_be_disabled()
    await photo_page.go_next()

    await expect(photo_page.photo_by_alt(photo_old.title)).to_be_visible()
    await expect(photo_page.carousel_next_btn).to_be_disabled()

    await photo_page.go_prev()
    await expect(photo_page.photo_by_alt(photo_new.title)).to_be_visible()
    await expect(photo_page.carousel_prev_btn).to_be_disabled()
