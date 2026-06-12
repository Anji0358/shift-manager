import type { ReactNode } from "react";
import { appStyles } from "@/components/shared/design-tokens";

type PageHeaderProps = {
    title: string;
    description?: string;
    label?: string;
    action?: ReactNode;
};

export const PageHeader = ({
    title,
    description,
    label = "Shift Manager",
    action,
}: PageHeaderProps) => {
    return (
        <section className={appStyles.header.wrapper}>
            <div>
                <p className={appStyles.header.label}>{label}</p>

                <h1 className={appStyles.header.title}>{title}</h1>

                {description ? (
                    <p className={appStyles.header.description}>
                        {description}
                    </p>
                ) : null}
            </div>

            {action ? <div className="shrink-0">{action}</div> : null}
        </section>
    );
};