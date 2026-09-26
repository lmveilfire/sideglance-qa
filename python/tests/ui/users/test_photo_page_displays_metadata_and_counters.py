import allure
from playwright.async_api import expect

from src.helpers.helpers import create_photo_with_category


@allure.title("Отображение метаданных и счетчиков просмотров/лайков на странице фотографии")
async def test_photo_page_displays_metadata_and_counters(
    gallery_page,
    category_client,
    photo_client,
    photo_page,
) -> None:

    photo, category = create_photo_with_category(category_client, photo_client)

    await gallery_page.goto()
    await gallery_page.select_category_by_name(category.name)
    await gallery_page.open_photo_by_alt(photo.title)

    await expect(photo_page.photo_by_alt(photo.title)).to_be_visible()
    await expect(photo_page.photo_place).to_have_text(photo.place)
    await expect(photo_page.photo_date).to_be_visible()
    await expect(photo_page.photo_meta).to_be_visible()
    await expect(photo_page.like_btn).to_be_visible()
    await expect(photo_page.views_count).to_be_visible()
