"use server";

import { exec } from "node:child_process";
import { promisify } from "node:util";
import os from "os";
import path from "path";
import fs from "fs/promises";

const execAsync = promisify(exec);

export async function generarBackup() {
  const user = process.env.USER_DB;
  const password = process.env.PASSWORD_DB;
  const database = process.env.DB_NAME;

  const timestamp = Date.now();
  const fileName = `backup-${timestamp}.sql`;

  const backupDir = path.join(process.cwd(), "backups");
  const finalPath = path.join(backupDir, fileName);

  
  await fs.mkdir(backupDir, { recursive: true });

  const tempPath = path.join(os.tmpdir(), fileName);

  const command = `mysqldump --user=${user} --password=${password} ${database} > "${tempPath}"`;

  await execAsync(command);

  
  await fs.copyFile(tempPath, finalPath);

  return fileName;
}

