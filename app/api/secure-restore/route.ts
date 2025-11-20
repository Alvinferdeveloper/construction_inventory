import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
    }

    
    const tempDir = os.tmpdir();
    const timestamp = Date.now();
    const filePath = path.join(tempDir, `restore-${timestamp}.sql`);
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    const user = process.env.USER_DB;
    const password = process.env.PASSWORD_DB;
    const database = process.env.DB_NAME;

    
    const command = `mysql --user=${user} --password="${password}" ${database} -e "source ${filePath}"`;
    await execAsync(command);

    
    fs.unlinkSync(filePath);

    return NextResponse.json({ message: "Base de datos restaurada correctamente" });
  } catch (err) {
    console.error("Error restaurando DB:", err);
    return NextResponse.json({ error: "Error restaurando la base de datos" }, { status: 500 });
  }
}
