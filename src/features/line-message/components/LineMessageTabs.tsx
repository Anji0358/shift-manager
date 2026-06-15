"use client";

import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import { MessageSquareText, Send } from "lucide-react";
import { appStyles } from "@/components/shared/design-tokens";
import { GroupJobMessageForm } from "./GroupJobMessageForm";
import { PersonalLineMessageForm } from "./PersonalLineMessageForm";

type LineMessageTabsProps = {
    selectedMonth: string;
    jobs: ComponentProps<typeof GroupJobMessageForm>["jobs"];
    employees: {
        id: string;
        name: string;
    }[];
    personalJobs: ComponentProps<typeof PersonalLineMessageForm>["jobs"];
    unavailableTimes: ComponentProps<
        typeof PersonalLineMessageForm
    >["unavailableTimes"];
};

type ActiveTab = "group" | "personal";

const tabItems: {
    value: ActiveTab;
    label: string;
    description: string;
    icon: ReactNode;
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
            <div className={appStyles.surface.nav}>
                <div className="grid gap-2 md:grid-cols-2">
                    {tabItems.map((tab) => {
                        const active = activeTab === tab.value;

                        return (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => setActiveTab(tab.value)}
                                className={[
                                    "flex items-center justify-center gap-3 px-4 py-4 text-left transition active:scale-[0.99]",
                                    appStyles.radius["2xl"],
                                    active
                                        ? [
                                            appStyles.nav.linkActive,
                                            appStyles.tokens.color.icon.childWhite,
                                        ].join(" ")
                                        : [
                                            appStyles.nav.linkInactive,
                                            appStyles.background.warmSubtle,
                                        ].join(" "),
                                ].join(" ")}
                            >
                                <span
                                    className={[
                                        "flex h-9 w-9 items-center justify-center",
                                        appStyles.radius.xl,
                                        active
                                            ? [
                                                "bg-white/20",
                                                appStyles.textColor.white,
                                            ].join(" ")
                                            : [
                                                appStyles.background.white,
                                                appStyles.textColor.accent,
                                                "shadow-sm",
                                            ].join(" "),
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
                                                ? appStyles.textColor.white
                                                : appStyles.textColor.muted,
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