import UserService from "@/src/services/user.service";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";
import { NextRequest, NextResponse } from "next/server";

// GET /api/user/id
// Resolves (or provisions) the local Prisma user id for the caller's verified Herald identity
export async function GET(req: NextRequest) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) {
    return NextResponse.json(
      { error: access.message },
      { status: access.error === "UNAUTHENTICATED" ? 401 : access.error === "FORBIDDEN" ? 403 : 502 }
    );
  }

  try {
    const userId = await UserService.getOrCreateUserId({ email: access.user.email });
    return NextResponse.json({ userId }, { status: 200 });
  } catch (error) {
    console.error("Error in fetching user: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
