export class Logger {
  public static error(...args: any[]): void {
    console.error("[Fb runtime error]", ...args);
  }

  public static warn(...args: any[]): void {
    console.warn("[Fb runtime warning]", ...args);
  }

  public static debug(...args: any[]): void {
    console.debug("[Fb runtime debug]", ...args);
  }

  public static formatBullets(bullets: string[]): string {
    return `\n- ${bullets.join("\n- ")}`;
  }
}
