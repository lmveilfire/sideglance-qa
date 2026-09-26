import allure
from playwright.async_api import expect

from src.helpers.helpers import create_photo_with_category


@allure.title("Просмотр фотографии во весь экран в режиме лайтбокса")
async def test_photo_page_lightbox(
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

    await photo_page.photo_by_alt(photo.title).click()

    await expect(photo_page.lightbox).to_be_visible()

    await photo_page.close_lightbox_btn.click()

    await expect(photo_page.lightbox).to_be_hidden()
