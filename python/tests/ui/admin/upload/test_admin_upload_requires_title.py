import allure
import pytest
from playwright.async_api import expect

from src.utils.constants import DEFAULT_FILE_PATH
from src.utils.generators import Generate


@pytest.mark.ui
@allure.title("Загрузка фото: отправка формы без заголовка блокируется валидацией")
async def test_admin_upload_requires_title(photo_upload_page, ui_auth_helper) -> None:

    photo_payload = Generate.photo_data()
    file_path = Generate.fixture_path(DEFAULT_FILE_PATH)
    category_name = Generate.category_data().name
    subcategory_name = Generate.category_data().name

    await ui_auth_helper.login_as_admin()
    await photo_upload_page.create_new_category(category_name)
    await photo_upload_page.select_category_by_name(category_name)
    await photo_upload_page.create_new_subcategory(subcategory_name)
    await photo_upload_page.select_subcategory_by_name(subcategory_name)
    await photo_upload_page.fill_author(photo_payload.author)
    await photo_upload_page.fill_taken_at(photo_payload.takenAt)
    await photo_upload_page.attach_photo(file_path)
    await photo_upload_page.submit_form()

    await expect(photo_upload_page.error_alert).to_be_visible()
