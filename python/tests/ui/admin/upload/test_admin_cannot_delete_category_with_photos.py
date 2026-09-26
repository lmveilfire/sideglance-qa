import allure
import pytest
from playwright.async_api import expect

from src.helpers.helpers import create_photo_with_category


@pytest.mark.ui
@allure.title("Защита данных: невозможность удаления категории, содержащей фотографии")
async def test_admin_cannot_delete_category_with_photos(
    photo_upload_page, ui_auth_helper, gallery_page, category_client, photo_client
) -> None:

    photo, category = create_photo_with_category(category_client, photo_client)
    await ui_auth_helper.login_as_admin()

    await photo_upload_page.home_btn.click()
    await gallery_page.select_category_by_name(category.name)

    await expect(gallery_page.photo_by_alt(photo.title)).to_be_visible()

    await gallery_page.delete_category(category.name)

    await expect(gallery_page.category_item_by_name(category.name)).to_be_visible()
