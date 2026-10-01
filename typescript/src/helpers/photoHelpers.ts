import { type CategoryClient } from '#clients/CategoryClient';
import { type PhotoClient } from '#clients/PhotoClient';
import { generate } from '#utils/generators';
import { type CategoryDto, type PhotoDto } from '#utils/schemas';
import { DEFAULT_FILE_PATH } from '#utils/constants';

export async function createPhotoWithCategory(
  categoryClient: CategoryClient,
  photoClient: PhotoClient,
  filename = DEFAULT_FILE_PATH,
): Promise<[PhotoDto, CategoryDto]> {
  const { name } = generate.categoryData();
  const category = await categoryClient.create(name);

  const photo = await photoClient.upload(
    generate.fixturePath(filename),
    generate.photoData({ categoryId: category.id }),
  );

  return [photo, category];
}

export async function createPhotoList(
  categoryId: number,
  photoClient: PhotoClient,
  count = 6,
): Promise<PhotoDto[]> {
  const fileExtension = '.jpg';
  const photoList: PhotoDto[] = [];
  const dateParam = 1;

  for (let i = 0; i < count; i++) {
    const dateStr = generate.getIsoDateOffset(i + dateParam);
    const photo = await photoClient.upload(
      generate.fixturePath(`${i + 1}${fileExtension}`),
      generate.photoData({ categoryId, takenAt: dateStr }),
    );
    photoList.push(photo);
  }

  return photoList;
}

export async function createPhotosInDifferentCategories(
  categoryClient: CategoryClient,
  photoClient: PhotoClient,
  count = 4,
): Promise<[PhotoDto, CategoryDto][]> {
  const result: [PhotoDto, CategoryDto][] = [];
  for (let i = 0; i < count; i++) {
    result.push(await createPhotoWithCategory(categoryClient, photoClient));
  }
  return result;
}
