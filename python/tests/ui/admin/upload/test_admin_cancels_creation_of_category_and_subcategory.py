import allure
import pytest
from playwright.async_api import expect

from src.utils.generators import Generate


@pytest.mark.ui
@allure.title("Отмена создания новой категории и подкатегории в панели управления")
async def test_admin_cancels_creation_of_category_and_subcategory(
    photo_upload_page,
    ui_auth_helper,
) -> None:

    category_name = Generate.category_data().name
    subcategory_name = Generate.category_data().name

    await ui_auth_helper.login_as_admin()
    await photo_upload_page.category_select.select_option(value="+new")
    await photo_upload_page.new_category_input.fill(category_name)
    await photo_upload_page.cancel_new_category()

    await expect(photo_upload_page.category_select).not_to_contain_text(category_name)

    await photo_upload_page.create_new_category(category_name)
    await photo_upload_page.select_category_by_name(category_name)
    await photo_upload_page.subcategory_select.select_option(value="+new")
    await photo_upload_page.new_subcategory_input.fill(subcategory_name)
    await photo_upload_page.cancel_new_subcategory()

    await expect(photo_upload_page.subcategory_select).not_to_contain_text(subcategory_name)
