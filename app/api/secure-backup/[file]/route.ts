import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  context: { params: Promise<{ file: string }> }
) {
  try {
  
    const { file } = await context.params;

    const filePath = path.join(process.cwd(), "backups", file);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Backup no encontrado" },
        { status: 404 }
      );
    }

    const data = fs.readFileSync(filePath);

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file}"`,
        "Content-Length": data.length.toString()
      }
    });

  } catch (e) {
    console.error(" Error en descarga:", e);
    return NextResponse.json({ error: "Error en servidor" }, { status: 500 });
  }
}
