import type { CategoryApi } from "../api/CategoryApi";
import type { CategoryDto } from "../utils/types";
import { statusIn } from "../utils/statusIn";
import { HTTP } from "../utils/constants";
import { step } from "../utils/decorators";
export class CategoryClient {
  private readonly api: CategoryApi;

  constructor(api: CategoryApi) {
    this.api = api;
  }

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
