import allure
from playwright.async_api import expect

from src.helpers.helpers import create_photo_with_category


@allure.title("Фильтрация фотографий по категориям в публичной галерее")
async def test_user_gallery_filter_by_category(
    gallery_page,
    category_client,
    photo_client,
) -> None:
    photo_first, category_first = create_photo_with_category(category_client, photo_client)
    photo_second, category_second = create_photo_with_category(category_client, photo_client)

    await gallery_page.goto()
    await gallery_page.select_category_by_name(category_first.name)
    await expect(gallery_page.photo_by_alt(photo_first.title)).to_be_visible()
    await expect(gallery_page.photo_by_alt(photo_second.title)).not_to_be_visible()

    await gallery_page.select_category_by_name(category_second.name)
    await expect(gallery_page.photo_by_alt(photo_second.title)).to_be_visible()
    await expect(gallery_page.photo_by_alt(photo_first.title)).not_to_be_visible()
