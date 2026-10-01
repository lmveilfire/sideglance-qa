import type { CategoryApi } from '#api/CategoryApi';
import { CategoryDtoSchema, CategoryListSchema, type CategoryDto } from '#utils/schemas';
import { assertStatus } from '#utils/apiHelpers';
import { HTTP } from '#utils/constants';
import { step } from '#utils/decorators';

export class CategoryClient {
  private readonly api: CategoryApi;

  constructor(api: CategoryApi) {
    this.api = api;
  }

  @step
  async create(name: string): Promise<CategoryDto> {
    const response = await this.api.create(name);
    await assertStatus(response, 'CategoryClient.create', HTTP.OK, HTTP.CREATED);
    return CategoryDtoSchema.parse(await response.json());
  }

  @step
  async delete(id: number): Promise<void> {
    const response = await this.api.deleteCategory(id);
    await assertStatus(response, 'CategoryClient.delete', HTTP.NO_CONTENT, HTTP.OK);
  }

  @step
  async categoryList(): Promise<CategoryDto[]> {
    const response = await this.api.getAll();
    await assertStatus(response, 'CategoryClient.list', HTTP.OK);
    return CategoryListSchema.parse(await response.json());
  }
}
