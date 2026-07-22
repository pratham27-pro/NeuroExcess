import { Storage } from "@plasmohq/storage"

import { normalizeHostname } from "~lib/settings/hostname"

import type { IssueCategory } from "./issueTypes"

export interface CategorySummary {
  category: IssueCategory
  label: string
  found: number
  fixed: number
}

export interface AuditSummary {
  totalIssues: number
  autoFixed: number
  remaining: number
  categories: CategorySummary[]
  updatedAt: number
}

const RESULT_KEY_PREFIX = "globalMode:result:"

// Local, not sync: an audit result is a derived snapshot of one tab's DOM at a point in time,
// not a user preference — same reasoning as site overrides in lib/settings/store.ts.
export const auditResultStorage = new Storage({ area: "local" })

export function auditResultKey(hostname: string): string {
  return `${RESULT_KEY_PREFIX}${normalizeHostname(hostname)}`
}

export async function setAuditSummary(hostname: string, summary: AuditSummary): Promise<void> {
  await auditResultStorage.set(auditResultKey(hostname), summary)
}

export async function clearAuditSummary(hostname: string): Promise<void> {
  await auditResultStorage.remove(auditResultKey(hostname))
}
