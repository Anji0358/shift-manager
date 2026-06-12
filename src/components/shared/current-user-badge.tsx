import { getCurrentUser } from "@/lib/auth/current-user";
import { Badge } from "@/components/ui/badge";
import { appStyles } from "@/components/shared/design-tokens";

export const CurrentUserBadge = async () => {
    const user = await getCurrentUser();

    if (!user) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 text-sm">
            <span className={appStyles.textColor.muted}>{user.name}</span>

            <Badge
                className={
                    user.role === "ADMIN"
                        ? appStyles.badge.fulfilled
                        : appStyles.badge.neutral
                }
            >
                {user.role === "ADMIN" ? "ADMIN" : "STAFF"}
            </Badge>
        </div>
    );
};