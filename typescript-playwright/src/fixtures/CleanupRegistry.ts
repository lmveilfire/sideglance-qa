export type CleanupTask = () => Promise<void>;

export class CleanupRegistry {
  private tasks: CleanupTask[] = [];

  register(fn: CleanupTask): void {
    this.tasks.push(fn);
  }

  async execute(): Promise<void> {
    for (const task of [...this.tasks].reverse()) {
      try { await task(); }
      catch (e) { console.warn(`[CleanupRegistry] task failed:`, e);}
    }
    this.tasks = [];
  }
}