"use client";

import { MessageSquareText, Send } from "lucide-react";
import { useState } from "react";
import { GroupJobMessageForm } from "./GroupJobMessageForm";
import { PersonalLineMessageForm } from "./PersonalLineMessageForm";

type LineMessageTabsProps = {
    selectedMonth: string;
    jobs: React.ComponentProps<typeof GroupJobMessageForm>["jobs"];
    employees: {
        id: string;
        name: string;
    }[];
    personalJobs: React.ComponentProps<typeof PersonalLineMessageForm>["jobs"];
    unavailableTimes: React.ComponentProps<
        typeof PersonalLineMessageForm
    >["unavailableTimes"];
};

type ActiveTab = "group" | "personal";

const tabItems: {
    value: ActiveTab;
    label: string;
    description: string;
    icon: React.ReactNode;
}[] = [
        {
            value: "group",
            label: "案件グループ用",
            description: "確認・詳細連絡",
            icon: <MessageSquareText className="h-4 w-4" />,
        },
        {
            value: "personal",
            label: "個人依頼文",
            description: "スタッフ個別依頼",
            icon: <Send className="h-4 w-4" />,
        },
    ];

export const LineMessageTabs = ({
    selectedMonth,
    jobs,
    employees,
    personalJobs,
    unavailableTimes,
}: LineMessageTabsProps) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>("group");

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border bg-white p-2 shadow-sm">
                <div className="grid gap-2 md:grid-cols-2">
                    {tabItems.map((tab) => {
                        const active = activeTab === tab.value;

                        return (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => setActiveTab(tab.value)}
                                className={[
                                    "flex items-center justify-center gap-3 rounded-2xl px-4 py-4 text-left transition",
                                    active
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200"
                                        : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                                ].join(" ")}
                            >
                                <span
                                    className={[
                                        "flex h-9 w-9 items-center justify-center rounded-xl",
                                        active
                                            ? "bg-white/20 text-white"
                                            : "bg-white text-blue-600 shadow-sm",
                                    ].join(" ")}
                                >
                                    {tab.icon}
                                </span>

                                <span>
                                    <span className="block text-sm font-bold">
                                        {tab.label}
                                    </span>
                                    <span
                                        className={[
                                            "mt-0.5 block text-xs",
                                            active
                                                ? "text-blue-50"
                                                : "text-slate-500",
                                        ].join(" ")}
                                    >
                                        {tab.description}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {activeTab === "group" ? (
                <GroupJobMessageForm jobs={jobs} selectedMonth={selectedMonth} />
            ) : (
                <PersonalLineMessageForm
                    employees={employees}
                    jobs={personalJobs}
                    unavailableTimes={unavailableTimes}
                    selectedMonth={selectedMonth}
                />
            )}
        </div>
    );
};