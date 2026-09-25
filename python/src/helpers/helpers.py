from src.clients.category_client import CategoryClient
from src.clients.photo_client import PhotoClient
from src.utils.constants import DEFAULT_FILE_PATH
from src.utils.generators import Generate
from src.utils.models import CategoryDto, PhotoDto


def create_photo_with_category(
    category_client: CategoryClient, photo_client: PhotoClient, filename: str = DEFAULT_FILE_PATH
) -> tuple[PhotoDto, CategoryDto]:
    category = category_client.create(Generate.category_data().name)

    photo = photo_client.upload(
        Generate.fixture_path(filename),
        Generate.photo_data(categoryId=category.id),
    )
    return photo, category


def create_photo_list(
    category_id: int, photo_client: PhotoClient, count: int = 6
) -> list[PhotoDto]:
    file_extension = ".jpg"
    photo_list: list[PhotoDto] = []
    for i in range(count):
        photo = photo_client.upload(
            Generate.fixture_path(f"{i + 1}{file_extension}"),
            Generate.photo_data(categoryId=category_id),
        )
        photo_list.append(photo)

    return photo_list
