# ArchitectOS

ArchitectOS is a learning product for becoming an elite software engineer + product architect. It is intentionally **not** a static roadmap: it combines a dependency-aware curriculum, per-topic proof-of-learning labs, progress tracking, curated resources, a technology radar, and automated freshness maintenance.

## Product principles

1. **Depth over completion theatre** — every topic follows Understand → Implement → Break → Measure → Explain.
2. **One evolving capstone** — the same product grows from Java fundamentals into a secure distributed, observable, AI-enabled system.
3. **Content is data** — topics and tech-radar sources are versioned JSON, not buried inside UI components.
4. **Freshness is explicit** — every topic/source has `lastVerified` + `refreshEveryDays`.
5. **Fast-moving areas refresh faster** — AI topics use short review windows; durable CS concepts use longer ones.

## Run locally

```bash
npm install
npm run dev
```

Validate and build:

```bash
npm run check
```

## Content model

- `content/topics/stage-*.json` — the versioned curriculum, split by stage for clean reviews and targeted refreshes.
- `content/topics.json` — generated automatically before dev/build/validation; do not edit it by hand.
- `content/blogs.json` — high-signal engineering/architecture/AI radar sources.
- `content/capstone.json` — the progressive capstone product.

Every topic automatically gets a repeatable **Resource refresh task** in the UI. The task asks a researcher/agent to verify current first-party material, remove weak links, detect deprecations, flag missing concepts, and propose a new refresh interval.

## Keeping ArchitectOS current

The repository-level `.github/workflows/architectos-resource-health.yml` runs weekly and can be triggered manually. It assembles the curriculum and scans the same freshness metadata used by the UI. When an item crosses its refresh interval, the workflow creates or updates a GitHub issue with the exact refresh queue.

The UI also exposes:

- freshness badges on every topic;
- a dedicated maintenance console;
- one-click copy of a topic-specific research task;
- a pre-filled GitHub issue composer for manual refresh work;
- a tech-radar audit task for every blog/source.

## Deployment

The repository-level `architectos-pages.yml` workflow is ready for GitHub Pages. After merging to `main`, enable **Pages → GitHub Actions** for the repository if it is not already configured, then run the workflow manually or let an ArchitectOS change trigger it.
