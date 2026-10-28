import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const [totalLinks, totalClicks, todayClicks, recentLinks] = await Promise.all([
            prisma.link.count(),
            prisma.link.aggregate({
                _sum: {
                    clickCount: true,
                },
            }),
            prisma.clickEvent.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
            prisma.link.findMany({
                orderBy: { createdAt: "desc" },
                take: 5,
                select: {
                    id: true,
                    shortCode: true,
                    originalUrl: true,
                    clickCount: true,
                    createdAt: true,
                },
            }),
        ]);

        return NextResponse.json({
            totalLinks,
            totalClicks: totalClicks._sum.clickCount ?? 0,
            todayClicks,
            recentLinks: recentLinks.map((link) => ({
                ...link,
                shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/${link.shortCode}`,
            })),
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: "Unable to load dashboard data." }, { status: 500 });
    }
}
