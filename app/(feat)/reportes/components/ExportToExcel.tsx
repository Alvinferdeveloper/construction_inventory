"use client";

import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface ExportToExcelProps<T> {
    data: T[];
    fileName: string;
    buttonText?: string;
}

export function ExportToExcel<T>({ data, fileName, buttonText = "Exportar a Excel" }: ExportToExcelProps<T>) {
    
    const exportData = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
        XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <Button onClick={exportData} variant="outline" size="sm" className="gap-2">
            <FileDown className="w-4 h-4" />
            {buttonText}
        </Button>
    );
}
