const tokens = {
    radius: {
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        "3xl": "rounded-3xl",
        full: "rounded-full",
    },

    color: {
        pageGradient:
            "bg-[radial-gradient(circle_at_top_left,_rgba(214,181,109,0.14),_transparent_30%),linear-gradient(180deg,_#fffdf8,_#ffffff)]",

        border: {
            default: "border-[#eadcc1]",
            soft: "border-[#f0e5d0]",
            accent: "border-[#d6b56d]/60",
            icon: "border-[#ead9b5]",
            danger: "border-red-200",
            pending: "border-amber-200",
        },

        background: {
            white: "bg-white",
            whiteSoft: "bg-white/70",
            whiteGlass: "bg-white/88",
            whiteHeader: "bg-white/82",
            whiteNav: "bg-white/90",
            whiteInput: "bg-white/90",
            whiteOverlay: "bg-white/80",
            whiteStrong: "bg-white/95",
            warm: "bg-[#fffaf0]",
            warmSoft: "bg-[#fffdf8]/80",
            warmSubtle: "bg-[#fffdf8]",
            warmHover: "bg-[#fff8e8]",
            accent: "bg-[#b8872d]",
            dark: "bg-slate-900",
            danger: "bg-red-50",
            pending: "bg-amber-50",

            hoverWhite: "hover:bg-white",
            hoverWarm: "hover:bg-[#fffaf0]",
            hoverWarmSubtle: "hover:bg-[#fffdf8]",
            hoverWarmHover: "hover:bg-[#fff8e8]",
            hoverAccent: "hover:bg-[#a77925]",
            hoverDark: "hover:bg-slate-700",
            hoverDanger: "hover:bg-red-100",
            hoverPending: "hover:bg-amber-50",
        },

        text: {
            default: "text-slate-900",
            body: "text-slate-600",
            muted: "text-slate-500",
            tableHead: "text-slate-700",
            iconMuted: "text-slate-400",
            accent: "text-[#b8872d]",
            accentDark: "text-[#8a641f]",
            white: "text-white",
            danger: "text-red-700",
            pending: "text-amber-700",

            hoverWhite: "hover:text-white",
            hoverAccent: "hover:text-[#b8872d]",
            hoverAccentDark: "hover:text-[#8a641f]",
            hoverDanger: "hover:text-red-700",
        },

        icon: {
            active: "stroke-[2.5] text-[#b8872d]",
            inactive: "stroke-2 text-slate-400",
            childWhite: "[&_svg]:text-white",
            childMuted: "[&_svg]:text-slate-400",
            childHoverAccent: "hover:[&_svg]:text-[#b8872d]",
        },

        ring: {
            accent: "focus-visible:ring-[#b8872d]",
        },
    },

    shadow: {
        card: "shadow-lg shadow-yellow-900/5",
        cardHover: "hover:shadow-xl",
        button: "shadow-md shadow-yellow-900/10",
        darkButton: "shadow-md shadow-slate-900/10",
        nav: "shadow-sm shadow-yellow-900/5",
        navActive: "shadow-md shadow-yellow-900/15",
        mobileNav: "shadow-[0_-8px_24px_rgba(120,79,20,0.08)]",
    },

    layout: {
        container: "mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8",
    },

    typography: {
        title: "font-serif font-medium text-slate-900",
        pageTitle:
            "font-serif text-3xl font-medium tracking-tight text-slate-900",
        body: "text-sm leading-6 text-slate-600",
        muted: "text-sm text-slate-500",
        label: "text-sm font-medium text-slate-700",
        eyebrow:
            "mb-2 text-xs font-medium uppercase tracking-[0.24em] text-[#b8872d]",
    },
} as const;

export const appStyles = {
    tokens,

    page: {
        shell: ["min-h-screen", tokens.color.pageGradient].join(" "),
        container: tokens.layout.container,
    },

    header: {
        wrapper: [
            "mb-6 flex flex-col gap-4 border p-5 backdrop-blur md:flex-row md:items-center md:justify-between",
            tokens.radius["3xl"],
            tokens.color.border.default,
            tokens.color.background.whiteHeader,
            tokens.shadow.card,
        ].join(" "),
        label: tokens.typography.eyebrow,
        title: tokens.typography.pageTitle,
        description: tokens.typography.body,
    },

    card: {
        base: [
            "border backdrop-blur",
            tokens.radius["2xl"],
            tokens.color.border.default,
            tokens.color.background.whiteGlass,
            tokens.color.text.default,
            tokens.shadow.card,
        ].join(" "),
        hover: [
            "transition hover:-translate-y-0.5",
            tokens.color.background.hoverWhite,
            tokens.shadow.cardHover,
        ].join(" "),
        section: "p-5",
    },

    section: {
        base: [
            "border p-5",
            tokens.radius["2xl"],
            tokens.color.border.soft,
            tokens.color.background.whiteSoft,
        ].join(" "),
        soft: [
            "border p-4",
            tokens.radius["2xl"],
            tokens.color.border.soft,
            tokens.color.background.warmSoft,
        ].join(" "),
        compact: [
            "border p-4",
            tokens.radius["2xl"],
            tokens.color.border.soft,
            tokens.color.background.whiteSoft,
        ].join(" "),
        message: [
            "border px-5 py-4",
            tokens.radius["2xl"],
            tokens.color.border.default,
            tokens.color.background.whiteGlass,
            tokens.shadow.card,
        ].join(" "),
    },

    surface: {
        white: [
            "border",
            tokens.radius["2xl"],
            tokens.color.border.default,
            tokens.color.background.white,
        ].join(" "),
        soft: [
            "border",
            tokens.radius["2xl"],
            tokens.color.border.soft,
            tokens.color.background.whiteSoft,
        ].join(" "),
        warm: [
            "border",
            tokens.radius["2xl"],
            tokens.color.border.soft,
            tokens.color.background.warmSoft,
        ].join(" "),
        nav: [
            "border p-1",
            tokens.radius["2xl"],
            tokens.color.border.default,
            tokens.color.background.whiteOverlay,
            tokens.shadow.nav,
        ].join(" "),
    },

    border: {
        default: tokens.color.border.default,
        soft: tokens.color.border.soft,
        accent: tokens.color.border.accent,
        icon: tokens.color.border.icon,
        danger: tokens.color.border.danger,
        pending: tokens.color.border.pending,
    },

    background: {
        white: tokens.color.background.white,
        whiteSoft: tokens.color.background.whiteSoft,
        whiteGlass: tokens.color.background.whiteGlass,
        whiteOverlay: tokens.color.background.whiteOverlay,
        warm: tokens.color.background.warm,
        warmSoft: tokens.color.background.warmSoft,
        warmSubtle: tokens.color.background.warmSubtle,
        warmHover: tokens.color.background.warmHover,
        accent: tokens.color.background.accent,
    },

    textColor: {
        default: tokens.color.text.default,
        body: tokens.color.text.body,
        muted: tokens.color.text.muted,
        tableHead: tokens.color.text.tableHead,
        iconMuted: tokens.color.text.iconMuted,
        accent: tokens.color.text.accent,
        accentDark: tokens.color.text.accentDark,
        white: tokens.color.text.white,
        danger: tokens.color.text.danger,
        pending: tokens.color.text.pending,
    },

    radius: tokens.radius,

    icon: {
        circle: [
            "flex h-11 w-11 shrink-0 items-center justify-center border",
            tokens.radius.full,
            tokens.color.border.icon,
            tokens.color.background.warm,
            tokens.color.text.accent,
        ].join(" "),
        smallCircle: [
            "flex h-10 w-10 shrink-0 items-center justify-center border",
            tokens.radius.full,
            tokens.color.border.icon,
            tokens.color.background.warm,
            tokens.color.text.accent,
        ].join(" "),
        accent: tokens.color.text.accent,
        muted: tokens.color.text.iconMuted,
    },

    button: {
        primary: [
            tokens.radius.xl,
            tokens.color.background.accent,
            tokens.color.text.white,
            tokens.shadow.button,
            tokens.color.background.hoverAccent,
            tokens.color.text.hoverWhite,
        ].join(" "),
        secondary: [
            tokens.radius.xl,
            tokens.color.border.accent,
            tokens.color.background.whiteOverlay,
            tokens.color.text.accentDark,
            tokens.color.background.hoverWarmHover,
            tokens.color.text.hoverAccentDark,
        ].join(" "),
        dark: [
            tokens.radius.xl,
            tokens.color.background.dark,
            tokens.color.text.white,
            tokens.shadow.darkButton,
            tokens.color.background.hoverDark,
            tokens.color.text.hoverWhite,
        ].join(" "),
        danger: [
            tokens.radius.xl,
            tokens.color.border.danger,
            tokens.color.background.danger,
            tokens.color.text.danger,
            tokens.color.background.hoverDanger,
            tokens.color.text.hoverDanger,
        ].join(" "),
    },

    form: {
        input: [
            tokens.radius.xl,
            tokens.color.border.default,
            tokens.color.background.whiteInput,
            "shadow-sm",
            tokens.color.ring.accent,
        ].join(" "),
        label: tokens.typography.label,
        textarea: [
            tokens.radius.xl,
            tokens.color.border.default,
            tokens.color.background.whiteInput,
            "min-h-28 shadow-sm",
            tokens.color.ring.accent,
        ].join(" "),
    },

    table: {
        wrapper: [
            "overflow-hidden border backdrop-blur",
            tokens.radius["2xl"],
            tokens.color.border.default,
            tokens.color.background.whiteInput,
            tokens.shadow.card,
        ].join(" "),
        headerRow: [
            tokens.color.border.default,
            tokens.color.background.warmHover,
            tokens.color.background.hoverWarmHover,
        ].join(" "),
        head: ["font-medium", tokens.color.text.tableHead].join(" "),
        row: [
            tokens.color.border.soft,
            "transition",
            tokens.color.background.hoverWarm,
        ].join(" "),
        cellMuted: ["text-sm", tokens.color.text.body].join(" "),
        empty: ["py-10 text-center", tokens.typography.muted].join(" "),
    },

    badge: {
        fulfilled: [
            tokens.radius.full,
            "border px-3 py-1 text-xs font-medium shadow-none",
            tokens.color.border.accent,
            tokens.color.background.warmHover,
            tokens.color.text.accentDark,
            tokens.color.background.hoverWarmHover,
        ].join(" "),
        pending: [
            tokens.radius.full,
            "border px-3 py-1 text-xs font-medium shadow-none",
            tokens.color.border.pending,
            tokens.color.background.pending,
            tokens.color.text.pending,
            tokens.color.background.hoverPending,
        ].join(" "),
        neutral: [
            tokens.radius.full,
            "border px-3 py-1 text-xs font-medium",
            tokens.color.border.default,
            tokens.color.background.warm,
            tokens.color.text.accentDark,
        ].join(" "),
    },

    nav: {
        desktopWrapper: [
            "flex items-center gap-1 border p-1",
            tokens.radius["2xl"],
            tokens.color.border.default,
            tokens.color.background.whiteOverlay,
            tokens.shadow.nav,
        ].join(" "),
        linkBase: [
            "inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold transition active:scale-95",
            tokens.radius.xl,
            "[&_svg]:h-4 [&_svg]:w-4",
        ].join(" "),
        linkActive: [
            "border",
            tokens.color.text.white,
            tokens.shadow.navActive,
            tokens.color.border.accent,
            tokens.color.background.accent,
            tokens.color.background.hoverAccent,
            tokens.color.text.hoverWhite,
            tokens.color.icon.childWhite,
        ].join(" "),
        linkInactive: [
            tokens.color.text.body,
            tokens.color.background.hoverWarmHover,
            tokens.color.text.hoverAccentDark,
            tokens.color.icon.childMuted,
            tokens.color.icon.childHoverAccent,
        ].join(" "),
        mobileWrapper: [
            "fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur md:hidden",
            tokens.color.border.default,
            tokens.color.background.whiteStrong,
            tokens.shadow.mobileNav,
        ].join(" "),
        mobileLinkBase:
            "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition active:scale-95",
        mobileLinkActive: [
            tokens.color.background.warmHover,
            tokens.color.text.accentDark,
            tokens.shadow.nav,
        ].join(" "),
        mobileLinkInactive: [
            tokens.color.text.muted,
            tokens.color.background.hoverWarmSubtle,
            tokens.color.text.hoverAccentDark,
        ].join(" "),
        mobileIconActive: tokens.color.icon.active,
        mobileIconInactive: tokens.color.icon.inactive,
    },

    layout: {
        appShell: [
            "min-h-screen pb-20 md:pb-0",
            tokens.color.pageGradient,
        ].join(" "),
        stickyHeader: [
            "sticky top-0 z-40 border-b shadow-sm backdrop-blur",
            tokens.color.background.whiteNav,
            tokens.shadow.nav,
            tokens.color.border.default,
        ].join(" "),
        headerInner:
            "mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8",
        brandIcon: [
            "flex h-10 w-10 items-center justify-center border transition",
            tokens.radius["2xl"],
            tokens.color.border.icon,
            tokens.color.background.warm,
            tokens.color.text.accent,
            tokens.shadow.nav,
            tokens.color.background.hoverWarmHover,
        ].join(" "),
    },

    text: {
        muted: tokens.typography.muted,
        body: tokens.typography.body,
        title: tokens.typography.title,
        accent: tokens.color.text.accent,
    },
};

export const bridalStyles = appStyles;