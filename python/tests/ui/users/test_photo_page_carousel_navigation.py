import allure
import pytest
from playwright.async_api import expect

from src.helpers.helpers import create_photo_list
from src.utils.generators import Generate


@pytest.mark.ui
@allure.title("Навигация между фотографиями в карусели на странице просмотра")
async def test_photo_page_carousel_navigation(
    gallery_page,
    category_client,
    photo_client,
    photo_page,
) -> None:

    count = 2
    category = category_client.create(f"{Generate.category_data().name}-cat")
    photo_list = create_photo_list(category.id, photo_client, count)

    await gallery_page.goto()
    await gallery_page.select_category_by_name(category.name)
    await gallery_page.open_photo_by_alt(photo_list[0].title)

    await expect(photo_page.photo_by_alt(photo_list[0].title)).to_be_visible()
    await expect(photo_page.carousel_prev_btn).to_be_disabled()

    await photo_page.go_next()

    await expect(photo_page.photo_by_alt(photo_list[1].title)).to_be_visible()
    await expect(photo_page.carousel_next_btn).to_be_disabled()

    await photo_page.go_prev()

    await expect(photo_page.photo_by_alt(photo_list[0].title)).to_be_visible()
