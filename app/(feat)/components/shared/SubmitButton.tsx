import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
    text: string;
    pending?: boolean;
}
export default function SubmitButton({ text, pending }: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            disabled={pending}
            className="cursor-pointer"
        >
            {pending ? "Cargando..." : text}
        </Button>
    )
}