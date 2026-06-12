import { logoutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { appStyles } from "@/components/shared/design-tokens";

export const LogoutButton = () => {
    return (
        <form action={logoutAction}>
            <Button
                type="submit"
                size="sm"
                variant="outline"
                className={appStyles.button.secondary}
            >
                ログアウト
            </Button>
        </form>
    );
};