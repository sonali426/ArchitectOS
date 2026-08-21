import type { Blog, Topic } from './types';

const MS_DAY = 86_400_000;
export const REPO = 'sonali426/Careersmet';

export function ageDays(date: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(`${date}T00:00:00Z`).getTime()) / MS_DAY));
}

export function freshness(item: { lastVerified: string; refreshEveryDays: number }) {
  const age = ageDays(item.lastVerified);
  const ratio = age / item.refreshEveryDays;
  if (ratio >= 1.25) return { label: 'Stale', tone: 'danger', age };
  if (ratio >= 0.85) return { label: 'Due soon', tone: 'warn', age };
  return { label: 'Fresh', tone: 'good', age };
}

export function topicRefreshPrompt(topic: Topic) {
  const existing = topic.resources.map((r) => `- ${r.title}: ${r.url}`).join('\n');
  return `You are maintaining ArchitectOS, a serious curriculum for senior/staff-level software engineers and product architects.\n\nTOPIC: ${topic.title}\nSUMMARY: ${topic.summary}\nCONCEPTS THAT MUST REMAIN COVERED: ${topic.concepts.join(', ')}\nCURRENT RESOURCES:\n${existing}\n\nTASK\nSearch the current web and re-curate the best learning resources for this topic. Treat this as a repeatable resource-quality audit, not a generic search.\n\nRESEARCH RULES\n1. Prefer current first-party documentation, canonical papers/books, university courses, and deep practitioner material from credible engineering organizations.\n2. Verify every URL works and the content still matches the topic.\n3. For fast-moving technologies, check current stable versions and deprecations.\n4. Keep at most 5 resources. Each must serve a distinct role: fundamentals, primary docs, deep dive, hands-on practice, or production case study.\n5. Remove shallow SEO/tutorial-farm content and redundant resources.\n6. Flag material that is excellent but historically useful rather than current.\n7. Identify any important concept now missing from the ArchitectOS topic definition.\n8. Return concise evidence for why each resource deserves to stay.\n\nOUTPUT\n- What changed since the previous resource set\n- Recommended resources: title, URL, type, why it is best\n- Resources to remove and why\n- Topic-definition updates, if any\n- New verification date in YYYY-MM-DD\n- Suggested refresh interval in days\n`;
}

export function radarRefreshPrompt(blog: Blog) {
  return `Audit the ArchitectOS Tech Radar source “${blog.name}” (${blog.url}). Verify the source is active and still high-signal for ${blog.focus.join(', ')}. Sample its most recent technical posts, separate deep engineering material from announcements, and recommend whether to KEEP, DOWNGRADE, REPLACE, or REMOVE it. If replacing it, propose a stronger primary source. Return a new verification date and refresh interval.`;
}

export function githubIssueUrl(title: string, body: string) {
  const params = new URLSearchParams({ title, body });
  return `https://github.com/${REPO}/issues/new?${params.toString()}`;
}
