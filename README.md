This session focuses on solving state drift in Angular applications. State drift happens when multiple components independently fetch and manage their own copies of shared data, leading to inconsistencies. The solution is to use a centralized store (NgRx SignalStore) as a single source of truth, ensuring all components stay in sync automatically.

📌 General Explanation
Problem: Local signals (signal()) are isolated. If two components each fetch enrollment data separately, they hold separate copies. Updates in one component don’t reflect in the other.

Solution: Use a singleton store with NgRx SignalStore. All components inject the same store, so when data changes, every component updates instantly without refresh or duplicate API calls.

Benefit: Eliminates drift, reduces redundant API calls, and ensures consistent UI state across the app.

🔎 Specific Explanation
Prerequisites

Define an Enrollment model (enrollment.model.ts).

Build an Enrollment service (enrollment.service.ts) to interact with the API.

Why Local Signals Drift

Each signal() call creates an independent reactive container.

Fine for local UI state (like toggles), but not for shared mutable data.

Install NgRx SignalStore

npm install @ngrx/signals

Build the Enrollment Store

Use signalStore with:

withState: adds simple properties (loading, error).

withEntities: manages enrollment records efficiently.

withComputed: creates derived signals (e.g., pendingCount).

withMethods: defines store methods like loadEnrollments and approveEnrollment.

Key Techniques:

concatMap ensures ordered API calls.

Optimistic updates: UI updates instantly before server confirmation, with rollback if the server rejects.

Wire Store into Components

Inject EnrollmentStore into components.

Bind templates directly to store signals (store.entities(), store.pendingCount()).

Result

Approving an enrollment updates both the list and dashboard summary instantly.

No refresh, no duplicate API calls, no drift.

Next Steps

Future sessions will cover performance optimization, defensive RxJS, and real-time sync with SignalR.

✅ In short: This lab teaches you how to replace scattered local signals with a centralized SignalStore, ensuring consistent, reactive state management across multiple Angular components.
