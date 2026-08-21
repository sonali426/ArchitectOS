import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const topicDir = path.join(root, 'content/topics');
const files = fs.readdirSync(topicDir).filter((f) => /^stage-\d+\.json$/.test(f)).sort((a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]));
const topics = files.flatMap((file) => JSON.parse(fs.readFileSync(path.join(topicDir, file), 'utf8')));
fs.writeFileSync(path.join(root, 'content/topics.json'), `${JSON.stringify(topics)}\n`);
console.log(`Generated content/topics.json from ${files.length} stages (${topics.length} topics).`);
