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
        <section className="mb-6 flex flex-col gap-4 rounded-3xl border border-[#eadcc1] bg-white/82 p-5 shadow-lg shadow-yellow-900/5 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-[#b8872d]">
                    {label}
                </p>

                <h1 className="font-serif text-3xl font-medium tracking-tight text-slate-900">
                    {title}
                </h1>

                {description ? (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {description}
                    </p>
                ) : null}
            </div>

            {action ? <div className="shrink-0">{action}</div> : null}
        </section>
    );
};