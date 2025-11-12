import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

export default function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            className="w-full cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors"
            disabled={pending}
        >
            {pending ? "Verificando..." : "Iniciar Sesión"}
        </Button>
    )
}