import type { Config } from "drizzle-kit";

export default {
  schema: "./schemas/*",
  out: "./drizzle",
} satisfies Config;