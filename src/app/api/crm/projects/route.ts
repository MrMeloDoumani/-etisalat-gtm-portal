import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "knowledge", "crm", "crm_stub.json");
    const fileContents = readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading CRM data:", error);
    return NextResponse.json(
      { error: "Failed to load CRM data" },
      { status: 500 }
    );
  }
}
