import allure
import pytest
from playwright.async_api import expect

from src.utils.generators import Generate


@pytest.mark.ui
@allure.title("Создание категории и подкатегории в панели управления")
async def test_admin_creates_category_and_subcategory(
    photo_upload_page, gallery_page, ui_auth_helper
) -> None:

    category_name = Generate.category_data().name
    subcategory_name = Generate.category_data().name

    await ui_auth_helper.login_as_admin()
    await photo_upload_page.create_new_category(category_name)

    await expect(photo_upload_page.category_select).to_contain_text(category_name)

    await photo_upload_page.select_category_by_name(category_name)
    await photo_upload_page.create_new_subcategory(subcategory_name)

    await expect(photo_upload_page.subcategory_select).to_contain_text(subcategory_name)

    await photo_upload_page.home_btn.click()

    await expect(gallery_page.category_item_by_name(category_name)).to_be_visible()

    await gallery_page.select_category_by_name(category_name)

    await expect(gallery_page.subcategory_item_by_name(subcategory_name)).to_be_visible()
