import { bridalStyles } from "@/components/shared/design-tokens";

type PageHeaderProps = {
    title: string;
    description?: string;
    label?: string;
    action?: React.ReactNode;
};

export const PageHeader = ({
    title,
    description,
    label = "Shift Manager",
    action,
}: PageHeaderProps) => {
    return (
        <section className={bridalStyles.header.wrapper}>
            <div>
                <p className={bridalStyles.header.label}>{label}</p>

                <h1 className={bridalStyles.header.title}>{title}</h1>

                {description ? (
                    <p className={bridalStyles.header.description}>{description}</p>
                ) : null}
            </div>

            {action ? <div className="shrink-0">{action}</div> : null}
        </section>
    );
};