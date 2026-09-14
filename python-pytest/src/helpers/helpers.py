from src.clients.category_client import CategoryClient
from src.clients.photo_client import PhotoClient
from src.utils.generators import Generate
from src.utils.types import CategoryDto, PhotoDto


def create_photo_with_category(
    category_client: CategoryClient, photo_client: PhotoClient, filename: str = "1.jpg"
) -> tuple[PhotoDto, CategoryDto]:
    category = category_client.create(Generate.category_data()["name"])
    photo = photo_client.upload(
        Generate.fixture_path(filename),
        Generate.photo_data(categoryId=category["id"]),
    )
    return photo, category
