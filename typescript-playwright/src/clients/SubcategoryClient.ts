import type { SubcategoryApi } from '../api/SubcategoryApi.ts';
import type { SubcategoryDto } from '../utils/types.ts';
import { statusIn } from '../utils/statusIn.ts';
import { HTTP } from '../utils/constants.ts';
import { step } from '../utils/decorators.ts';

export class SubcategoryClient {
  constructor(private readonly api: SubcategoryApi) {}

  @step()
  async create(categoryId: number, name: string): Promise<SubcategoryDto> {
    const response = await this.api.create(categoryId, name);
    if (!statusIn(HTTP.OK, HTTP.CREATED)(response.status())) {
      throw new Error(
        `[SubcategoryClient] create failed: ${response.status()} ${await response.text()}`
      );
    }
    return response.json() as Promise<SubcategoryDto>;
  }

  @step()
  async delete(subcategoryId: number): Promise<void> {
    await this.api.deleteSubcategory(subcategoryId);
  }

  @step()
  async listByCategoryId(categoryId: number): Promise<SubcategoryDto[]> {
    const response = await this.api.getByCategoryId(categoryId);
    if (!statusIn(HTTP.OK)(response.status())) {
      throw new Error(
        `[SubcategoryClient] getByCategoryId failed: ${response.status()} ${await response.text()}`
      );
    }
    return response.json() as Promise<SubcategoryDto[]>;
  }
}