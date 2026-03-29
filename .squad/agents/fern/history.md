# Fern — History

## Context
Joined the coven as a second Backend Engineer to share load with Hecate. The ForestOmni platform is a Blazor + .NET 9 / Orleans microservices system. Backend work spans domain modelling, gRPC, event sourcing, and persistence.

## Session Log
- **Onboarded** to ForestOmni Mother repository alongside Sage (Performance Engineer).

## Learnings
- **Copyright headers**: All new `.cs` files in this repo must have `// Copyright ForestOmni AB.` as the very first line. River will reject PRs that are missing it. Added to 10 files across Domain and UIAdminComponents as part of issue #385 fix.
- **N+1 advisory**: When a loop makes sequential gRPC calls, document the intent inline if it's acceptable short-term, with a TODO pointing to the future bulk API.
- **Proto line endings**: `userstoregrpc.proto` uses Windows CRLF line endings. Use `Get-Content -Raw` and CRLF-aware regex when patching it via PowerShell; simple `\n` patterns will fail to match.
- **UserStoreService.cs DI**: `ICmsPostSubjectService` is registered in `FO.Identity.UserStore.Service/Program.cs` using the grain-backed `CmsPostSubjectService`. The API_GRPC project does NOT have its own Program.cs — it is hosted by the Silo (`FO.Identity.UserStore.Service`).
- **Map.cs already partially complete**: As of this session, `Map.cs` had `CmsPostInternalHeadline` already wired into `CreateCmsPostCommand` and `SaveDraftCmsPostCommand` FROM requests. Only the `From(CmsPostAggregate)` response mapping used `.ToString()` instead of `.Value` (now fixed). UserStoreClientGRPCWrapper.GetCmsPost already handled InternalHeadline with a `"–"` placeholder.
- **AddUserStoreAdminServices silo-side caveat**: UIAdminComponents has no project reference to `FO.Identity.UserStore.Service`, so `CmsPostSubjectClientService` (which needs `IUserStoreClientGRPC`) is registered on both silo and gRPC-client sides. Hosts using `AddUserStoreAdminServices` must also register `IUserStoreClientGRPC` for `CmsPostSubjectClientService` to resolve correctly.
