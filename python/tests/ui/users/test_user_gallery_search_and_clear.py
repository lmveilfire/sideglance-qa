import allure
import pytest
from playwright.async_api import expect

from src.helpers.photo_helpers import create_photos_in_different_categories


@pytest.mark.ui
@allure.title("Поиск фотографий по текстовому запросу и очистка результатов поиска")
async def test_user_gallery_search_and_clear(
    gallery_page,
    category_client,
    photo_client,
) -> None:

    free_photo_title = "never give up"
    photo_list = create_photos_in_different_categories(category_client, photo_client, 6)

    await gallery_page.goto()
    await gallery_page.search_photo(photo_list[2][0].title)

    await expect(gallery_page.photo_by_alt(photo_list[2][0].title)).to_be_visible()

    await gallery_page.clear_search()
    await gallery_page.search_photo(free_photo_title)
    await expect(gallery_page.empty_state_message).to_be_visible()
