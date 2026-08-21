# ArchitectOS V2 — Curriculum & Product Redesign

## North star

ArchitectOS V2 is not a roadmap of topics. It is a **competency graph** for becoming an elite software engineer and product architect.

A learner should be able to answer three questions at any point:

1. **What should I learn next and why?**
2. **What evidence proves I actually understand it?**
3. **How does this knowledge connect to larger systems and architecture?**

## New knowledge hierarchy

V1 used `Stage → Topic → Concepts`.

V2 uses:

`Domain → Track → Module → Topic → Concept → Resource → Practice → Evidence`

### Domain
A durable body of engineering knowledge, such as Computer Systems, Java/JVM, Data Systems, Distributed Systems, System Design, Security, Frontend/Browser, Cloud/Platform, Reliability, AI Systems, or Technical Leadership.

### Track
A coherent learning lane inside a domain. Example inside System Design: Design Method, Building Blocks, Scaling Patterns, Product Systems, Platform Systems.

### Module
A unit large enough to form a meaningful competency but small enough to master deliberately. Example: Load Balancing & Traffic Distribution.

### Topic
A concrete concept or skill. Example: L4 vs L7 load balancing.

### Concept
Fine-grained knowledge elements needed for mastery.

### Practice
Implementation, failure injection, measurement, design exercise, or architecture review.

### Evidence
Artifacts proving learning: code, design doc, benchmark, incident analysis, diagram, RFC, explanation, or review notes.

## Mastery levels

Every module is assessed at four depths:

- **Foundation** — explain terminology and mechanics.
- **Engineer** — implement and debug it.
- **Senior** — reason about production failure, performance, security, and trade-offs.
- **Architect** — choose among alternatives under product, scale, cost, organizational, regulatory, and migration constraints.

A module is not complete merely because its reading is complete.

## Mastery loop

Every module should follow:

1. Understand
2. Implement
3. Break
4. Measure
5. Explain
6. Design
7. Review

V2 adds the last two steps explicitly because implementation skill alone does not create architecture judgment.

## Curriculum breadth

V2 is organized into 14 domains:

1. Programming & Software Engineering
2. Java & JVM Engineering
3. Algorithms & Data Structures
4. Computer Systems & Operating Systems
5. Networking & Internet Systems
6. Browser, Frontend & Client Architecture
7. Backend, APIs & Integration
8. Databases, Storage & Data Systems
9. Security, Identity & Privacy
10. Distributed Systems & Messaging
11. Cloud, Platform & Delivery
12. Reliability, Performance & Production Engineering
13. System Design & Product Architecture
14. AI-Enabled & Agentic Systems

Technical leadership, architecture communication, and product judgment are cross-cutting capabilities embedded throughout, with dedicated advanced modules in Domain 13.

## System Design redesign

System Design becomes a major domain rather than one card. It contains six tracks:

### A. Design reasoning
- Requirement discovery
- Constraint identification
- NFR modeling
- Back-of-the-envelope estimation
- Traffic modeling
- Capacity planning
- Data modeling from access patterns
- API/event modeling
- Bottleneck analysis
- Failure-mode analysis
- Cost modeling
- Evolution planning
- Trade-off communication

### B. Architecture building blocks
- DNS, CDN and edge
- Reverse proxies and gateways
- L4/L7 load balancing
- API gateways and BFFs
- Stateless/stateful compute
- Background workers
- Schedulers
- Caching layers
- Queues and pub/sub
- Distributed logs
- Search systems
- Object/file storage
- Databases and replicas
- Sharding and partitioning
- Rate limiting and admission control
- Service discovery and config
- Distributed coordination
- Observability architecture

### C. Scaling and resilience patterns
- Horizontal scaling
- Hot partition mitigation
- Fan-out strategies
- Read/write scaling
- Async decoupling
- CQRS
- Event sourcing
- Sagas and outbox
- Backpressure
- Load shedding
- Graceful degradation
- Multi-region design
- DR and failover
- Multi-tenancy
- Cell-based architecture
- Data locality and residency

### D. Product-system design labs
- URL shortener
- Notification service
- Chat / WhatsApp
- Slack-like collaboration
- News feed / Twitter
- Instagram
- YouTube / Netflix
- Dropbox / Drive
- Search autocomplete
- Web crawler
- Ticket booking
- E-commerce
- Payments ledger
- Ride hailing
- Collaborative editor

### E. Platform-system design labs
- Distributed cache
- Rate limiter
- Job scheduler
- Message broker
- Kafka-like log
- Search engine
- Metrics platform
- Logging platform
- Feature flag platform
- Identity platform
- API gateway
- Workflow engine
- Object storage
- Configuration service

### F. Architecture review & evolution
- V1 → 10x → 100x evolution
- Brownfield migration
- Build vs buy
- Platform vs product boundary
- Architecture decision records
- RFC writing
- Threat modeling
- Cost and FinOps review
- Operational readiness
- Incident-informed redesign
- Architecture review facilitation

## Design labs are adaptive

A V2 design lab should not reveal a static answer. It should evolve the constraints:

1. Design V1.
2. Increase traffic 100×.
3. Add a latency SLO.
4. Inject a regional or dependency failure.
5. Add enterprise compliance/data residency.
6. Add cost pressure.
7. Add migration constraints.
8. Defend the design in an architecture review.

This turns system design from memorization into judgment training.

## Mastery evidence model

Each module may require one or more evidence types:

- `implementation` — runnable code or configuration
- `failure_experiment` — intentionally induced failure and analysis
- `measurement` — benchmark/profile/query-plan/trace/metrics
- `design` — diagram/system design/decision matrix
- `explanation` — concise written or verbal explanation
- `review` — critique of another design or self-review against a rubric
- `production_case` — analysis of a real engineering incident or case study

Progress should eventually be calculated from evidence, not a single checkbox.

## Freshness V2

V2 splits maintenance into four separate systems:

### 1. Resource freshness
Are the currently recommended resources still the best ones?

### 2. Curriculum drift
Are we still teaching the right concepts and technologies?

### 3. Version/deprecation watch
Have Java, Spring, React, PostgreSQL, Kubernetes, cloud services, standards, or AI tooling materially changed?

### 4. Technology radar
What new engineering practices or architectural patterns deserve attention, but not necessarily curriculum inclusion yet?

The desired maintenance loop is:

`Detect → Research → Compare → Propose → Human Review → Merge → Redeploy`

The system should never silently rewrite the curriculum without review.

## V2 implementation checkpoints

### Checkpoint 1 — Curriculum foundation
- New domain/track/module schema
- Full breadth inventory
- Deep System Design inventory
- Design lab catalog
- Mastery evidence schema
- Curriculum drift scanner specification

### Checkpoint 2 — V2 navigation
- Domain explorer
- Track/module drill-down
- Dependency graph
- Beginner/Senior/Architect views
- Design Lab workspace

### Checkpoint 3 — Evidence-based progress
- Module evidence requirements
- Notes/artifact links
- Mastery rubric
- Progress based on evidence quality

### Checkpoint 4 — Maintenance intelligence
- Resource-health queue
- Curriculum drift queue
- Version watch
- AI-assisted update proposals

### Checkpoint 5 — Learning operating system
- Personalized next-step engine
- Revision queue
- Weak-area detection
- Architecture review challenges
- Capstone integration

## What V2 explicitly avoids

- Flat lists of hundreds of buzzwords
- Marking topics complete after watching content
- Tool-first learning without fundamentals
- Memorized system-design answers
- Treating cloud certifications as architecture mastery
- Automatically accepting AI-generated curriculum changes
