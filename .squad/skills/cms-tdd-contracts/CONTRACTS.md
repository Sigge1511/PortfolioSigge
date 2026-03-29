# CMS TDD Backend Contracts

## Purpose
This document defines the minimum backend contracts required for the new CMS TDD suites to compile and pass.

## Test Status by Area

| Area | Location | Current status | Blocker |
|---|---|---|---|
| Domain model tests | `UserStore/test/FO.Identity.UserStore.Cms.Domain.Tests/CmsModels/` | Compile now | None (domain model exists) |
| Grain state tests | `UserStore/test/FO.Identity.UserStore.Cms.Grain.Tests/GrainStates/` | Blocked | Missing grain state classes |
| Grain test helper | `UserStore/test/FO.Identity.UserStore.Cms.Grain.Tests/TestHelpers/CmsGrainTestDataBuilder.cs` | Blocked | Depends on missing grain states/contracts |
| Service tests | `UserStore/test/FO.Identity.UserStore.Cms.Service.Tests/Services/` | Blocked | Missing services and grain interfaces |
| Service test helper | `UserStore/test/FO.Identity.UserStore.Cms.Service.Tests/TestHelpers/FakeLogger.cs` | Compile-ready helper | Consumed by blocked service tests |

## Required Grain States

Target location: `FO.Identity.UserStore.Grains/CmsPost/`

| Type | Required behavior |
|---|---|
| `CmsPostGrainState` | Apply `Created`, `Updated`, `SavedDraft`, `PublishedNow`, `Scheduled`, `SoftDeleted` events |
| `CmsPostFeedGrainState` | Apply `Created`, `Updated`, `SoftDeleted` events |
| `CmsPostMailListGrainState` | Apply `Created`, `Updated`, `SoftDeleted` events |
| `CmsPostImageGrainState` | Apply `Uploaded`, `Updated`, `AddedToPost`, `SoftDeleted` events |
| `CmsPostAuthLevelGrainState` | Apply `Created`, `Updated`, `SoftDeleted` events |
| `CmsPostAiCheckGrainState` | Apply `Created`, `Updated`, `SoftDeleted` events |

## Required Grain Interfaces

Target project: grains project (Orleans)

| Interface | Base type | Required members |
|---|---|---|
| `ICmsPostGrain` | `IGrainWithStringKey` | `GetState` + `Handle` for all post commands |
| `ICmsPostFeedGrain` | `IGrainWithStringKey` | `GetState` + `Handle` for feed commands |
| `ICmsPostMailListGrain` | `IGrainWithStringKey` | `GetState` + `Handle` for mail list commands |
| `ICmsPostImageGrain` | `IGrainWithStringKey` | `GetState` + `Handle` for image commands |
| `ICmsPostAuthLevelGrain` | `IGrainWithStringKey` | `GetState` + `Handle` for auth-level commands |
| `ICmsPostAiCheckGrain` | `IGrainWithStringKey` | `GetState` + `Handle` for AI-check commands |

## Required Services

Target namespace: `FO.Identity.UserStore.Service.Cms.Services`

| Service | Required methods |
|---|---|
| `CmsPostEditorService` | `CreatePostAsync`, `SaveDraftAsync`, `PublishNowAsync`, `SchedulePostAsync`, `SoftDeletePostAsync` |
| `CmsPostFeedAdminService` | `CreateFeedAsync`, `UpdateFeedAsync`, `SoftDeleteFeedAsync`, `GetFeedAsync` |

## Security Requirements (Vespera)

| Requirement | Contract implication |
|---|---|
| Soft-delete must null data | `SoftDeleted` application in all relevant grain states must clear sensitive and user-facing payload fields, not only set a flag |
| Auth level is sensitive | `CmsPostAuthLevelGrainState` and related command handlers must treat auth level as protected data (least exposure in DTOs/state reads) |

## Service Naming Decisions (Morgana)

| Decision | Rationale |
|---|---|
| Use `CmsPostEditorService` for post lifecycle actions | Keeps authoring workflow operations grouped by editor intent |
| Use `CmsPostFeedAdminService` for feed administration actions | Separates feed governance from post editing concerns |
| Keep both in `FO.Identity.UserStore.Service.Cms.Services` | Consistent discovery and test fixture wiring |

## Immediate Build Order

1. Implement grain states and event application logic.
2. Implement grain interfaces with `GetState` and command `Handle` signatures.
3. Implement `CmsPostEditorService` and `CmsPostFeedAdminService` against grain interfaces.
4. Run grain tests, then service tests.
