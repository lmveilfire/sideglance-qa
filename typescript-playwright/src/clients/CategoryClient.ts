import type { CategoryApi } from "../api/CategoryApi.ts";
import type { CategoryDto } from "../utils/types.ts";
import { statusIn } from "../utils/statusIn.ts";
import { HTTP } from "../utils/constants.ts";
import { step } from "../utils/decorators.ts";
export class CategoryClient {
  constructor(private readonly api: CategoryApi) {}

  @step()
  async create(name: string): Promise<CategoryDto> {
    const response = await this.api.create(name);
    if (!statusIn(HTTP.OK, HTTP.CREATED)(response.status())) {
      throw new Error(
        `[CategoryClient] create failed: ${response.status()} ${await response.text()}`,
      );
    }
    return response.json() as Promise<CategoryDto>;
  }

  @step()
  async delete(id: number): Promise<void> {
    await this.api.deleteCategory(id);
  }

  @step()
  async list(): Promise<CategoryDto[]> {
    const response = await this.api.getAll();
    return response.json() as Promise<CategoryDto[]>;
  }
}
