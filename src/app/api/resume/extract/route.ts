import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    const isPdf =
      file.type === "application/pdf" ||
      file.type === "application/x-pdf" ||
      name.endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        { error: "Only PDF files are supported for extraction" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });

    const cleaned = text.replace(/\s+/g, " ").trim();

    if (!cleaned) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this PDF. It may be image-based — try pasting your resume text instead.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ text: cleaned.slice(0, 12000) });
  } catch (error) {
    console.error("PDF extraction error:", error);
    return NextResponse.json(
      { error: "Failed to read PDF. Please try a different file or paste text." },
      { status: 500 }
    );
  }
}
