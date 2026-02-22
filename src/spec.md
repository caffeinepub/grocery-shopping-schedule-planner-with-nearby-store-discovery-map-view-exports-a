# Specification

## Summary
**Goal:** Build a mobile-responsive grocery shopping planner that collects a user’s location, time, budget, and items (typed or voice input), discovers nearby grocery shops with map + list views, recommends a top-3 shopping schedule, supports exports (ICS/PDF), persists schedules in an Internet Computer (Motoko) backend, and offers an English/Hindi UI toggle.

**Planned changes:**
- Create a mobile-first form flow to capture location (manual + optional geolocation), preferred date/time, budget, and an editable item list with optional Web Speech API voice-to-text input.
- Implement nearby shop discovery via a configurable places provider (default OpenStreetMap; optional Google Places with in-app API key), returning shop name, address, distance, opening status, phone (if available), and ETA; add robust error handling and empty states.
- Add demo mode for Indore, India with sample shops/items (including at least one D-Mart) to keep discovery testable without external API keys.
- Add item-to-category inference with a simple, editable mapping UI and use categories to bias/filter discovery where supported.
- Generate a “Top 3” recommended shopping schedule ranked by open-now then distance (and rating when available), including suggested visit times based on preferred time + opening hours when available.
- Add cost estimation using an India-focused built-in price table, budget/affordability indicators, highest-cost item highlighting, and per-item price overrides.
- Add shopping helpers: quick-buy goodies/snacks list, estimated price comparison across discovered shops using per-shop multipliers, and reorder/clone from past schedules.
- Add map visualization plotting user location + shops and enabling shop selection from map markers to view details.
- Implement schedule exports: downloadable calendar event (.ics) and PDF including items, selected shop details, estimated total cost, and editable reminders/notes.
- Persist schedules in a single Motoko actor canister with create/read/list/delete, stable storage across upgrades, and a “My schedules” UI to view/delete/reorder.
- Add bilingual UI toggle (English/Hindi) with immediate switching and local persistence, falling back to English for missing strings.
- Apply a consistent warm, India-inspired visual theme optimized for one-handed mobile use.
- Add setup/deployment documentation for local dev and IC mainnet, including optional external API key configuration and demo mode usage.

**User-visible outcome:** Users can plan a grocery trip by entering items, budget, and time; discover nearby shops on a list and map (or via Indore demo mode); get top recommendations with suggested visit times and cost estimates; save and manage schedules; reorder past plans; and export a chosen schedule as ICS or PDF, all with an English/Hindi toggle.
