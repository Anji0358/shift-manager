type PageShellProps = {
    children: React.ReactNode;
    className?: string;
};

export const PageShell = ({ children, className }: PageShellProps) => {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(214,181,109,0.14),_transparent_30%),linear-gradient(180deg,_#fffdf8,_#ffffff)]">
            <div
                className={[
                    "mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8",
                    className,
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                {children}
            </div>
        </div>
    );
};