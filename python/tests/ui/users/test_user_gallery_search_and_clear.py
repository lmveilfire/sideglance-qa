import allure
import pytest
from playwright.async_api import expect

from src.helpers.helpers import create_photo_with_category
from src.utils.models import CategoryDto, PhotoDto


@pytest.mark.ui
@allure.title("Поиск фотографий по текстовому запросу и очистка результатов поиска")
async def test_user_gallery_search_and_clear(
    gallery_page,
    category_client,
    photo_client,
) -> None:

    count = 4
    free_photo_title = "never give up"
    photo_list: list[tuple[PhotoDto, CategoryDto]] = []

    for _ in range(count):
        photo, category = create_photo_with_category(category_client, photo_client)
        photo_list.append((photo, category))

    await gallery_page.goto()
    await gallery_page.search_photo(photo_list[2][0].title)

    await expect(gallery_page.photo_card_list.locator("img")).to_have_count(1)
    await expect(gallery_page.photo_by_alt(photo_list[2][0].title)).to_be_visible()

    await gallery_page.clear_search()
    await gallery_page.search_photo(free_photo_title)
    await expect(gallery_page.empty_state_message).to_be_visible()
