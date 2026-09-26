import allure
from playwright.async_api import expect

from src.utils.constants import DEFAULT_FILE_PATH
from src.utils.generators import Generate


@allure.title("Загрузка новой фотографии в подкатегорию с верификацией отображения в галерее")
async def test_admin_upload_photo_to_subcategory(
    photo_upload_page, ui_auth_helper, gallery_page
) -> None:

    photo_payload = Generate.photo_data()
    file_path = Generate.fixture_path(DEFAULT_FILE_PATH)
    category_name = Generate.category_data().name
    subcategory_name = Generate.category_data().name

    await ui_auth_helper.login_as_admin()
    await photo_upload_page.create_new_category(category_name)
    await photo_upload_page.select_category_by_name(category_name)
    await photo_upload_page.create_new_subcategory(subcategory_name)
    await photo_upload_page.select_subcategory_by_name(subcategory_name)
    await photo_upload_page.fill_title(photo_payload.title)
    await photo_upload_page.fill_author(photo_payload.author)
    await photo_upload_page.fill_taken_at(photo_payload.takenAt)
    await photo_upload_page.attach_photo(file_path)
    await photo_upload_page.submit_form()

    await expect(photo_upload_page.success_alert).to_be_visible()

    await photo_upload_page.home_btn.click()
    await gallery_page.select_category_by_name(category_name)
    await gallery_page.select_subcategory_by_name(subcategory_name)

    await expect(gallery_page.photo_by_alt(photo_payload.title)).to_be_visible()
