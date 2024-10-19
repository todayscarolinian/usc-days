import AuthService from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const email = req.nextUrl.searchParams.get("email");
        
        if (!email) return NextResponse.json({ error: "Email not found" }, { status: 400 });

        const userId = await AuthService.getUserId({ email });
        return NextResponse.json({ userId }, { status: 200 });
    } catch (error) {
        console.error("Error in fetching user: ", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}