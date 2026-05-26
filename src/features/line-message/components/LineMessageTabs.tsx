"use client";

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

export const LineMessageTabs = ({
    selectedMonth,
    jobs,
    employees,
    personalJobs,
    unavailableTimes,
}: LineMessageTabsProps) => {
    const [activeTab, setActiveTab] = useState<"group" | "personal">("group");

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab("group")}
                        className={[
                            "rounded-xl px-4 py-3 text-sm font-medium transition",
                            activeTab === "group"
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:bg-slate-100",
                        ].join(" ")}
                    >
                        案件グループ用
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("personal")}
                        className={[
                            "rounded-xl px-4 py-3 text-sm font-medium transition",
                            activeTab === "personal"
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:bg-slate-100",
                        ].join(" ")}
                    >
                        個人依頼文
                    </button>
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