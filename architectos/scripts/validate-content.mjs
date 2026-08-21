import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const topics = JSON.parse(fs.readFileSync(path.join(root, 'content/topics.json'), 'utf8'));
const blogs = JSON.parse(fs.readFileSync(path.join(root, 'content/blogs.json'), 'utf8'));
const errors = [];
const ids = new Set();
for (const t of topics) {
  if (!t.id || !t.title || !t.summary) errors.push(`Topic missing core fields: ${JSON.stringify(t).slice(0,120)}`);
  if (ids.has(t.id)) errors.push(`Duplicate topic id: ${t.id}`); ids.add(t.id);
  if (!Array.isArray(t.concepts) || t.concepts.length < 3) errors.push(`${t.id}: needs >= 3 concepts`);
  if (!Array.isArray(t.resources) || t.resources.length < 1) errors.push(`${t.id}: needs resources`);
  if (!t.lab) errors.push(`${t.id}: missing proof-of-learning lab`);
  if (!t.refreshEveryDays || t.refreshEveryDays < 7) errors.push(`${t.id}: invalid refresh policy`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t.lastVerified)) errors.push(`${t.id}: invalid lastVerified`);
  for (const r of t.resources || []) {
    if (!r.url || (!r.url.startsWith('http') && !r.url.startsWith('#'))) errors.push(`${t.id}: invalid resource URL ${r.url}`);
  }
}
for (const t of topics) for (const p of t.prerequisites || []) if (!ids.has(p)) errors.push(`${t.id}: unknown prerequisite ${p}`);
for (const b of blogs) {
  if (!b.name || !b.url || !b.url.startsWith('http')) errors.push(`Invalid blog: ${b.name}`);
  if (!b.refreshEveryDays) errors.push(`${b.name}: missing refresh policy`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`ArchitectOS content valid: ${topics.length} topics, ${blogs.length} radar sources.`);
