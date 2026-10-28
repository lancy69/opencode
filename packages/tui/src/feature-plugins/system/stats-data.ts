import type { SessionStatsInfo } from "@opencode/client"

export function statsMetrics(stats: SessionStatsInfo) {
  return {
    tokens: [
      {
        label: "INPUT TOKENS",
        value: stats.tokens.input + stats.tokens.cache.read + stats.tokens.cache.write,
      },
      { label: "OUTPUT TOKENS", value: stats.tokens.output },
    ],
    activity: [
      { label: "best streak", value: stats.streak },
      { label: "active days", value: stats.activeDays },
      { label: "sessions", value: stats.sessions },
    ],
  }
}

export function statsNumber(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)
}
