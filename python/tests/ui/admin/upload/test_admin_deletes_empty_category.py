import allure
from playwright.async_api import expect

from src.utils.generators import Generate


@allure.title("Удаление пустой категории")
async def test_admin_deletes_empty_category(
    gallery_page,
    ui_auth_helper,
    photo_upload_page,
    category_client,
) -> None:

    category_name = Generate.category_data().name
    category_client.create(category_name)

    await ui_auth_helper.login_as_admin()
    await photo_upload_page.home_btn.click()

    await expect(gallery_page.category_item_by_name(category_name)).to_be_visible()

    await gallery_page.delete_category(category_name)

    await expect(gallery_page.category_item_by_name(category_name)).not_to_be_visible()
