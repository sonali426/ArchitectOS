# ArchitectOS V2 curriculum model

V2 changes the learning model from a flat `Stage -> Topic -> Concepts` list into a competency graph:

`Domain -> Module -> Learning Unit -> Concept -> Resource -> Practice -> Mastery Evidence`

## Why

A unit is the smallest thing that can honestly be completed. Umbrella labels such as `System design`, `Java`, `Security`, or `Databases` are modules/domains, not checkboxes.

Every **learning unit** must have:

- a concise summary;
- explicit concepts;
- canonical resource references;
- a practical challenge;
- a concrete mastery artifact/evidence;
- a depth level (`foundation`, `working`, `deep`, `architect`);
- a prerequisite path or an intentional independent entry point.

Every **module** must have:

- a clear reason it exists;
- a mapping to the V1 topic(s) it replaces/expands;
- at least two learning units unless there is a documented reason;
- resource and curriculum review policies;
- at least one architecture/trade-off question at deep/architect level.

## Mastery loop

Completion requires evidence across five modes:

1. **Understand** — explain the model and vocabulary without copying a source.
2. **Implement** — build a minimal working form.
3. **Break** — reproduce a realistic failure or misuse.
4. **Measure** — use the correct tool/metric to observe behaviour.
5. **Explain** — justify trade-offs, alternatives, limits, and when the design changes.

## Maintenance model

V2 separates two previously conflated concerns:

- **Resource health** — are the linked resources still current, reachable, and the best choices?
- **Curriculum drift** — does the inventory itself still represent what an elite engineer/product architect should know?

Curriculum drift is checked against external baselines such as ACM/IEEE/AAAI CS2023, IEEE SWEBOK v4, major standards, platform/runtime documentation, security baselines, SRE guidance, and high-signal engineering practice.

## Iterative migration policy

Each V1 topic is migrated one-by-one into one or more V2 modules. A topic is only considered migrated when all of its V1 concepts are mapped and the V2 module has added the missing depth needed for professional/architect competence.

Migration statuses are tracked in `migration-map.json`.
