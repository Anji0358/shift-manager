import { bridalStyles } from "@/components/shared/design-tokens";

type PageShellProps = {
    children: React.ReactNode;
    className?: string;
};

export const PageShell = ({ children, className }: PageShellProps) => {
    return (
        <div className={bridalStyles.page.shell}>
            <div
                className={[bridalStyles.page.container, className]
                    .filter(Boolean)
                    .join(" ")}
            >
                {children}
            </div>
        </div>
    );
};