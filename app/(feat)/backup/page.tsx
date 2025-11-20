"use client";

import { useState } from "react";
import { generarBackup } from "@/app/lib/actions/backup";
import { Loader2, CheckCircle, AlertCircle, Download, Database, UploadCloud } from "lucide-react";

export default function BackupRestoreFull() {
  const [loading, setLoading] = useState(false);
  const [estado, setEstado] = useState<"normal" | "ok" | "error">("normal");

  async function handleBackup() {
    try {
      setLoading(true);
      setEstado("normal");
      const file = await generarBackup();
      const link = document.createElement("a");
      link.href = `/api/secure-backup/${file}`;
      link.download = file;
      link.click();
      setEstado("ok");
    } catch (err) {
      console.error(err);
      setEstado("error");
    } finally {
      setLoading(false);
      setTimeout(() => setEstado("normal"), 3000);
    }
  }

  const getButtonStyles = () => {
    const base = "flex items-center justify-center gap-3 px-8 py-5 text-white rounded-2xl shadow-xl transition-all duration-300 font-semibold w-full max-w-lg";
    if (loading) return `${base} bg-blue-500 cursor-wait opacity-90`;
    if (estado === "error") return `${base} bg-red-500 hover:bg-red-600 cursor-not-allowed`;
    return `${base} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 cursor-pointer`;
  };

  const getEstadoStyles = () => {
    const base = "flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 animate-in fade-in-50";
    switch (estado) {
      case "ok": return `${base} bg-green-50 border-green-200 text-green-700`;
      case "error": return `${base} bg-red-50 border-red-200 text-red-700`;
      default: return "hidden";
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-50 gap-16 p-10">
      
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-10">
        
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

          <button onClick={handleBackup} disabled={loading || estado === "error"} className={getButtonStyles()}>
            {loading ? (
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

          <div className={getEstadoStyles()}>
            {estado === "ok" && (
              <>
                <CheckCircle size={22} className="flex-shrink-0" />
                <div>
                  <p className="font-medium">¡Respaldo generado correctamente!</p>
                  <p className="text-sm opacity-80">El archivo se está descargando automáticamente</p>
                </div>
              </>
            )}
            {estado === "error" && (
              <>
                <AlertCircle size={22} className="flex-shrink-0" />
                <div>
                  <p className="font-medium">Error al generar el respaldo</p>
                  <p className="text-sm opacity-80">Intenta nuevamente en unos momentos</p>
                </div>
              </>
            )}
          </div>

          <p className="mt-2 text-sm text-gray-500 text-center">
            El proceso puede tardar según el tamaño de la base de datos
          </p>
        </div>

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

          <input type="file" accept=".sql" disabled className="w-full p-4 border rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed" />

          <button disabled className="flex items-center justify-center gap-3 px-8 py-5 mt-4 bg-gray-400 text-white rounded-2xl cursor-not-allowed">
            <UploadCloud size={22} />
            Restaurar Base de Datos (próximamente)
          </button>

          <p className="mt-2 text-sm text-gray-500 text-center">
            Esta función estará disponible en una próxima actualización
          </p>
        </div>

      </div>
    </div>
  );
}
