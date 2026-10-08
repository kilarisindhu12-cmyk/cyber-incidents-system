---
name: Generated fetch client DOM types
description: TypeScript library configuration needed by the generated API client.
---

When a generated fetch client reports that `Headers.entries` is missing, include `dom.iterable` in that package's TypeScript `lib` list alongside `dom`.

**Why:** the generated header-merging helper uses iterable DOM APIs, which are not declared by the base `dom` library alone.

**How to apply:** check the API client's `tsconfig` when regenerating Orval clients and typechecking fails on `Headers.entries`.
