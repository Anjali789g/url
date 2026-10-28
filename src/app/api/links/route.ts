import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function generateCode(length = 7) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i += 1) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }

    return result;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const url = typeof body?.url === "string" ? body.url.trim() : "";

        if (!url) {
            return NextResponse.json({ error: "URL is required." }, { status: 400 });
        }

        let normalizedUrl = url;
        if (!/^https?:\/\//i.test(normalizedUrl)) {
            normalizedUrl = `https://${normalizedUrl}`;
        }

        try {
            new URL(normalizedUrl);
        } catch {
            return NextResponse.json({ error: "Please provide a valid URL." }, { status: 400 });
        }

        let shortCode = generateCode();
        let safeCode = shortCode;

        while (await prisma.link.findUnique({ where: { shortCode: safeCode } })) {
            safeCode = generateCode();
        }

        shortCode = safeCode;

        const link = await prisma.link.create({
            data: {
                shortCode,
                originalUrl: normalizedUrl,
            },
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        return NextResponse.json({
            id: link.id,
            shortCode: link.shortCode,
            shortUrl: `${baseUrl}/${link.shortCode}`,
        }, { status: 201 });
    } catch (error) {
        console.error("Create link error:", error);
        return NextResponse.json({ error: "Failed to create short link." }, { status: 500 });
    }
}
