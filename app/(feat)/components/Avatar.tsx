import { Avatar, AvatarFallback } from "@/components/ui/avatar";
export function AvatarComponent({ name, bgColor }: { name: string; bgColor: string }) {
    return (
        <Avatar className={`${bgColor}`}>
            <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
    )
}