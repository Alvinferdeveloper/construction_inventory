import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
    text: string;
    pending?: boolean;
    formAction?: (formData: FormData) => void;
}
export default function SubmitButton({ text, pending, formAction }: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            formAction={formAction}
            disabled={pending}
            className="cursor-pointer"
        >
            {pending ? "Cargando..." : text}
        </Button>
    )
}