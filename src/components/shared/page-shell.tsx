import type { ReactNode } from "react";
import { appStyles } from "@/components/shared/design-tokens";

type PageShellProps = {
    children: ReactNode;
    className?: string;
};

export const PageShell = ({ children, className }: PageShellProps) => {
    return (
        <div className={appStyles.page.shell}>
            <div
                className={[appStyles.page.container, className]
                    .filter(Boolean)
                    .join(" ")}
            >
                {children}
            </div>
        </div>
    );
};