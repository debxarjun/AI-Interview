export function isPdfFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    file.type === "application/pdf" ||
    file.type === "application/x-pdf" ||
    name.endsWith(".pdf")
  );
}

export function isTxtFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return file.type === "text/plain" || name.endsWith(".txt");
}

export async function extractTextFromFile(file: File): Promise<string> {
  if (isTxtFile(file)) {
    return file.text();
  }

  if (isPdfFile(file)) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/resume/extract", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "Failed to extract PDF text");
    }

    const data = await res.json();
    return data.text as string;
  }

  throw new Error("Unsupported file type. Please upload a PDF or TXT file.");
}
