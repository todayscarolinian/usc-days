# API route conventions

Shared helpers live in `src/lib/api` (import from `@/src/lib/api`). Use them instead of hand-rolling responses.

## URLs

- Collection: `app/api/<resource>/route.ts` → `GET` (list), `POST` (create).
- Item: `app/api/<resource>/[id]/route.ts` → `GET`, `PUT` (full replacement), `DELETE`.
- IDs go in the path, never in the request body. `DELETE` has no body.
- Related collections are nested: `/api/sports/{id}/teams`, not `/api/teamgametypes?sportId=`.
- Plural, lowercase resource names.

## Status codes

| Case | Status |
| --- | --- |
| Read / update OK | 200 |
| Created | 201 + `Location: /api/<resource>/{id}` |
| Deleted | 204, no body |
| Malformed JSON, invalid query/path param, schema failure | 400 |
| Not logged in / not authorized | 401 / 403 (via `accessErrorResponse`) |
| Item does not exist | 404 |
| Duplicate / still referenced | 409 |
| Herald unreachable | 502 |
| Anything else | 500, generic message |

## Bodies

- Success: return the resource itself (`NextResponse.json(team)`), not `{ newTeam }` / `{ updatedTeam }`.
- Lists: `{ data: T[] }`, plus `nextCursor` when paginated. Shape must not depend on which query params were sent.
- Errors: `{ error: string, code: ApiErrorCode, details? }`. `error` must stay a string — `parseApiError` in `src/lib/error-handler.ts` reads it.
- Never put `${error}` or Prisma messages in a response. `handleRouteError` logs and hides them.

## Handler shape

```ts
// app/api/teams/[id]/route.ts
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  const body = await parseJsonBody(req, EditTeamSchema);
  if (!body.ok) return body.response;

  try {
    const team = await teamService.editTeam(id.data, body.data);
    return NextResponse.json(team);
  } catch (error) {
    return handleRouteError(error, "Could not update team.");
  }
}
```

- Query params: build a `z.object` from `idQuery`, `boolQuery`, `startOfDayQuery`, `limitQuery()`, etc. and call `parseQuery`. Invalid values are a 400, not silently ignored.
- Dates in query strings are `YYYY-MM-DD` event days in Asia/Manila (see `src/lib/time.ts`), with `endDate` covering the whole day.
- Facebook posts interpret date ranges in `Asia/Manila`. Homepage news uses the fixed inclusive range October 17–24, 2026; event posts remain visible afterward.

## Services

- Let Prisma errors propagate (or rethrow the original) — don't wrap them in `new Error("...")`, or the 404/409 mapping is lost.
- For domain rule failures, throw `new ApiError("CONFLICT", "...")` (or `NOT_FOUND`, etc.) instead of relying on message text.
- Don't change delete semantics (hard vs soft delete) as part of route refactors.
