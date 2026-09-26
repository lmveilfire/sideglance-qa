import allure
from playwright.async_api import expect

from src.helpers.helpers import create_photo_list
from src.utils.generators import Generate


@allure.title("Отображение всех загруженных фотографий на главной странице галереи")
async def test_home_page_displays_all_uploaded_photos(
    gallery_page,
    category_client,
    photo_client,
) -> None:

    count = 6
    category = category_client.create(f"{Generate.category_data().name}-cat")
    photo_list = create_photo_list(category.id, photo_client, count)

    await gallery_page.goto()
    await gallery_page.select_category_by_name(category.name)

    for photo in photo_list:
        await expect(gallery_page.photo_by_alt(photo.title)).to_be_visible()
