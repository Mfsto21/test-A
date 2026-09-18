import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSession } from "@/lib/session";

// Vercel's serverless functions cap request bodies at a few MB, which is
// why routing a drone video through /api/upload (the classic
// POST-the-whole-file-to-our-server path) would hang or fail — the file
// never even finishes reaching our function. Client uploads sidestep that
// entirely: the browser gets a short-lived token from this route, then
// streams the file bytes straight to Vercel Blob, never through our
// serverless function at all. See UploadField for the client side.
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "application/pdf",
];

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (!session || session.role !== "BUILDER") {
    return NextResponse.json({ error: "Only the MJF team can upload files." }, { status: 403 });
  }

  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_TYPES,
        addRandomSuffix: true,
        maximumSizeInBytes: 2 * 1024 * 1024 * 1024, // 2GB — generous for drone footage
      }),
    });
    return NextResponse.json(jsonResponse);
  } catch (err) {
    console.error("Upload token generation failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 400 }
    );
  }
}
