export const bridalStyles = {
  page: {
    shell:
      "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(214,181,109,0.14),_transparent_30%),linear-gradient(180deg,_#fffdf8,_#ffffff)]",
    container: "mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8",
  },

  header: {
    wrapper:
      "mb-6 flex flex-col gap-4 rounded-3xl border border-[#eadcc1] bg-white/82 p-5 shadow-lg shadow-yellow-900/5 backdrop-blur md:flex-row md:items-center md:justify-between",
    label:
      "mb-2 text-xs font-medium uppercase tracking-[0.24em] text-[#b8872d]",
    title: "font-serif text-3xl font-medium tracking-tight text-slate-900",
    description: "mt-2 text-sm leading-6 text-slate-600",
  },

  card: {
    base:
      "rounded-2xl border border-[#eadcc1] bg-white/88 text-slate-900 shadow-lg shadow-yellow-900/5 backdrop-blur",
    hover: "transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl",
    section: "p-5",
  },

  icon: {
    circle:
      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ead9b5] bg-[#fffaf0] text-[#b8872d]",
    smallCircle:
      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ead9b5] bg-[#fffaf0] text-[#b8872d]",
  },

  button: {
    primary:
      "rounded-xl bg-[#b8872d] text-white shadow-md shadow-yellow-900/10 hover:bg-[#a77925] hover:text-white",
    secondary:
      "rounded-xl border-[#d6b56d]/60 bg-white/80 text-[#8a641f] hover:bg-[#fff8e8] hover:text-[#8a641f]",
    dark:
      "rounded-xl bg-slate-900 text-white shadow-md shadow-slate-900/10 hover:bg-slate-700 hover:text-white",
    danger:
      "rounded-xl border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-700",
  },

  form: {
    input:
      "rounded-xl border-[#eadcc1] bg-white/90 shadow-sm focus-visible:ring-[#b8872d]",
    label: "text-sm font-medium text-slate-700",
  },

  table: {
    wrapper:
      "overflow-hidden rounded-2xl border border-[#eadcc1] bg-white/90 shadow-lg shadow-yellow-900/5 backdrop-blur",
    headerRow: "border-[#eadcc1] bg-[#fff8e8] hover:bg-[#fff8e8]",
    head: "font-medium text-slate-700",
    row: "border-[#f0e5d0] transition hover:bg-[#fffaf0]",
  },

  badge: {
    fulfilled:
      "rounded-full border border-[#d6b56d]/60 bg-[#fff8e8] px-3 py-1 text-xs font-medium text-[#8a641f] shadow-none hover:bg-[#fff8e8]",
    pending:
      "rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 shadow-none hover:bg-amber-50",
    neutral:
      "rounded-full border border-[#eadcc1] bg-[#fffaf0] px-3 py-1 text-xs font-medium text-[#8a641f]",
  },

  text: {
    muted: "text-sm text-slate-500",
    body: "text-sm leading-6 text-slate-600",
    title: "font-serif font-medium text-slate-900",
  },
};