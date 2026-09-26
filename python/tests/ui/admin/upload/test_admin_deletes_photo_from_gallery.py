import allure
from playwright.async_api import expect

from src.helpers.helpers import create_photo_with_category


@allure.title("Удаление фотографии внутри категории")
async def test_admin_deletes_photo_from_gallery(
    gallery_page, ui_auth_helper, photo_upload_page, photo_client, category_client
) -> None:

    photo, category = create_photo_with_category(category_client, photo_client)
    await ui_auth_helper.login_as_admin()
    await photo_upload_page.home_btn.click()

    await gallery_page.select_category_by_name(category.name)

    await expect(gallery_page.photo_img(photo.id)).to_be_visible()

    await gallery_page.delete_photo(photo.id)

    await expect(gallery_page.empty_state_message).to_be_visible()

    await gallery_page.search_photo(photo.title)
    await expect(gallery_page.empty_state_message).to_be_visible()
