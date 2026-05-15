import { getCurrentUser } from "@/lib/auth/current-user";
import { Badge } from "@/components/ui/badge";

export const CurrentUserBadge = async () => {
    const user = await getCurrentUser();

    if (!user) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">{user.name}</span>
            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                {user.role === "ADMIN" ? "ADMIN" : "STAFF"}
            </Badge>
        </div>
    );
};