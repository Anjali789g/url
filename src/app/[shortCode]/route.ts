import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ shortCode: string }> },
) {
    try {
        const { shortCode } = await params;

        if (!shortCode) {
            return NextResponse.json({ error: "Missing short code." }, { status: 400 });
        }

        const link = await prisma.link.findUnique({
            where: { shortCode },
        });

        if (!link) {
            return NextResponse.json({ error: "Short link not found." }, { status: 404 });
        }

        await prisma.$transaction([
            prisma.link.update({
                where: { id: link.id },
                data: {
                    clickCount: {
                        increment: 1,
                    },
                },
            }),
            prisma.clickEvent.create({
                data: {
                    linkId: link.id,
                },
            }),
        ]);

        return NextResponse.redirect(new URL(link.originalUrl));
    } catch (error) {
        console.error("Redirect link error:", error);
        return NextResponse.json({ error: "Failed to redirect short link." }, { status: 500 });
    }
}
