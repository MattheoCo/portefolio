# CTF Matrix & Invariants

This document records the invariants and behavior per level.

## Overview of Levels
- Level 0: Proxy pass-through, backend accepts all input.
- Level 1: Proxy naive filtering (blocklist), backend still weak.
- Level 2: Proxy requires session token (unsigned, cleartext). Backend only checks presence.
- Level 3: Proxy applies partial sanitization/normalization. Backend has weak models.
- Level 4: Proxy RBAC vs backend resource-based ACL mismatch.
- Level 5: Full security but a subtle logic bug across services.

## Minimal formal spec (example)
- Proxy assumptions: incoming requests are normalized to UTF-8, proxy may enforce allowed methods, proxy may require `X-Session` header when LEVEL>=2.
- Backend guarantees: persistent storage of accepted payloads; when `Auth` header present (not validated) will be stored with metadata.

## Scenarios to explore
- Level 0: Send arbitrary JSON to `/api/store`, then GET `/api/dump` to inspect stored entries.
- Level 1: Try payloads that bypass simple string blocklists (e.g., encoded payloads).
- Level 2: Inspect session token format and craft custom token to bypass presence checks.
- Level 3: Find divergence between normalization and backend parsing (e.g., different handling of unicode/whitespace).
- Level 4: Compare allowed operations reported by proxy vs enforced by backend. Try privilege escalation via request tampering.
- Level 5: Search for race/timing/state inconsistencies that create exploitable conditions.

## State transitions (example table)
- See later iterations for a formal table mapping request -> proxy state -> backend state -> expected result.


