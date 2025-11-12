import { Button } from "@/components/ui/button"

export default function SubmitButton({ loading }: { loading: boolean }) {
    return (
        <Button
            type="submit"
            className="w-full cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors"
            disabled={loading}
        >
            {loading ? "Verificando..." : "Iniciar Sesión"}
        </Button>
    )
}