import { logoutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

export const LogoutButton = () => {
    return (
        <form action={logoutAction}>
            <Button type="submit" size="sm" variant="outline">
                ログアウト
            </Button>
        </form>
    );
};