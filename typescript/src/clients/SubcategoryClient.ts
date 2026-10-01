import type { SubcategoryApi } from '../api/SubcategoryApi.js';
import {
  SubcategoryDtoSchema,
  SubcategoryListSchema,
  type SubcategoryDto,
} from '../utils/schemas.js';
import { assertStatus } from '../utils/apiHelpers.js';
import { HTTP } from '../utils/constants.js';
import { step } from '#utils/decorators';

export class SubcategoryClient {
  private readonly api: SubcategoryApi;

  constructor(api: SubcategoryApi) {
    this.api = api;
  }

  @step
  async create(categoryId: number, name: string): Promise<SubcategoryDto> {
    const response = await this.api.create(categoryId, name);
    await assertStatus(response, 'SubcategoryClient.create', HTTP.OK, HTTP.CREATED);
    return SubcategoryDtoSchema.parse(await response.json());
  }

  @step
  async delete(subcategoryId: number): Promise<void> {
    const response = await this.api.deleteSubcategory(subcategoryId);
    await assertStatus(response, 'SubcategoryClient.delete', HTTP.NO_CONTENT, HTTP.OK);
  }

  @step
  async listByCategoryId(categoryId: number): Promise<SubcategoryDto[]> {
    const response = await this.api.getByCategoryId(categoryId);
    await assertStatus(response, 'SubcategoryClient.listByCategoryId', HTTP.OK);
    return SubcategoryListSchema.parse(await response.json());
  }
}
