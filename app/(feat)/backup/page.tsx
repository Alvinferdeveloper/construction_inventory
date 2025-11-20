"use client";

import { useState } from "react";
import { generarBackup } from "@/app/lib/actions/backup";
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Database, 
  UploadCloud 
} from "lucide-react";

export default function BackupRestorePage() {
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupEstado, setBackupEstado] = useState<"normal" | "ok" | "error">("normal");

  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreEstado, setRestoreEstado] = useState<"normal" | "ok" | "error">("normal");

  async function handleBackup() {
    try {
      setBackupLoading(true);
      setBackupEstado("normal");

      const file = await generarBackup();
      const link = document.createElement("a");
      link.href = `/api/secure-backup/${file}`;
      link.download = file;
      link.click();

      setBackupEstado("ok");
    } catch (err) {
      console.error(err);
      setBackupEstado("error");
    } finally {
      setBackupLoading(false);
      setTimeout(() => setBackupEstado("normal"), 3000);
    }
  }

  async function handleRestore(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setRestoreLoading(true);
      setRestoreEstado("normal");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/secure-restore", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error restaurando");

      setRestoreEstado("ok");
    } catch (err) {
      console.error(err);
      setRestoreEstado("error");
    } finally {
      setRestoreLoading(false);
      setTimeout(() => setRestoreEstado("normal"), 4000);
    }
  }

  const getButtonStyles = (loading: boolean, estado: string, color: string) => {
    const base = "flex items-center justify-center gap-3 px-8 py-5 text-white rounded-2xl shadow-xl transition-all duration-300 font-semibold w-full max-w-lg";
    if (loading) return `${base} bg-${color}-500 cursor-wait opacity-90`;
    if (estado === "error") return `${base} bg-red-500 hover:bg-red-600 cursor-not-allowed`;
    return `${base} bg-gradient-to-r from-${color}-600 to-${color}-700 hover:from-${color}-700 hover:to-${color}-800 active:scale-95 cursor-pointer`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-50 gap-16 p-10">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10">

        {/* CARD BACKUP */}
        <div className="flex-1 p-8 bg-white rounded-3xl shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-xl">
              <Database className="text-blue-600" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Respaldo de Base de Datos</h2>
              <p className="text-gray-600 mt-1">Genera una copia de seguridad de toda la información</p>
            </div>
          </div>

          <button onClick={handleBackup} disabled={backupLoading || backupEstado === "error"} className={getButtonStyles(backupLoading, backupEstado, "blue")}>
            {backupLoading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span className="text-lg">Generando respaldo...</span>
              </>
            ) : (
              <>
                <Download size={24} />
                <span className="text-lg">Generar Backup Seguro</span>
              </>
            )}
          </button>

          {backupEstado !== "normal" && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-300 ${backupEstado === "ok" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              {backupEstado === "ok" ? (
                <>
                  <CheckCircle size={20} />
                  <span>¡Respaldo generado correctamente!</span>
                </>
              ) : (
                <>
                  <AlertCircle size={20} />
                  <span>Error al generar el respaldo</span>
                </>
              )}
            </div>
          )}

          <p className="mt-2 text-sm text-gray-500 text-center">
            El proceso puede tardar según el tamaño de la base de datos
          </p>
        </div>

        {/* CARD RESTORE */}
        <div className="flex-1 p-8 bg-white rounded-3xl shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-100 rounded-xl">
              <UploadCloud className="text-purple-600" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Restaurar Base de Datos</h2>
              <p className="text-gray-600 mt-1">Carga un archivo .sql para restaurar toda la información</p>
            </div>
          </div>

          <input 
            type="file" 
            accept=".sql" 
            onChange={handleRestore} 
            disabled={restoreLoading} 
            className="w-full p-4 border rounded-xl bg-gray-50 text-gray-700 cursor-pointer" 
          />

          {/* Loader y estados encima del botón */}
          {(restoreLoading || restoreEstado !== "normal") && (
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border mb-2 transition-all duration-300
              bg-purple-50 border-purple-200 text-purple-700">
              {restoreLoading && (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Restaurando base de datos...</span>
                </>
              )}
              {restoreEstado === "ok" && (
                <>
                  <CheckCircle size={20} />
                  <span>Base de datos restaurada correctamente</span>
                </>
              )}
              {restoreEstado === "error" && (
                <>
                  <AlertCircle size={20} />
                  <span>Error al restaurar la base de datos</span>
                </>
              )}
            </div>
          )}

         

          <p className="mt-2 text-sm text-gray-500 text-center">
            Esta acción sobrescribirá la base de datos actual
          </p>
        </div>

      </div>
    </div>
  );
}
