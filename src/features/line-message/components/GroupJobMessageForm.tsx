"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";
import { generateGroupJobMessage } from "../message-generators";
import type {
    GroupLineMessageJob,
    GroupMessageOptions,
    GroupMessageType,
} from "../types";
import { GeneratedMessagePanel } from "./GeneratedMessagePanel";

type GroupJobMessageFormProps = {
    selectedMonth: string;
    jobs: GroupLineMessageJob[];
};

const messageOptionItems: {
    key: keyof GroupMessageOptions;
    label: string;
}[] = [
        {
            key: "includeMeetingPlace",
            label: "集合場所を含める",
        },
        {
            key: "includeDressCode",
            label: "服装を含める",
        },
        {
            key: "includeBelongings",
            label: "持ち物を含める",
        },
        {
            key: "includeNote",
            label: "備考を含める",
        },
    ];

export const GroupJobMessageForm = ({
    jobs,
    selectedMonth,
}: GroupJobMessageFormProps) => {
    const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id ?? "");
    const [messageType, setMessageType] =
        useState<GroupMessageType>("scheduleConfirm");
    const [options, setOptions] = useState<GroupMessageOptions>({
        includeMeetingPlace: true,
        includeDressCode: true,
        includeBelongings: true,
        includeNote: true,
    });
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState(false);

    const selectedJob = useMemo(() => {
        return jobs.find((job) => job.id === selectedJobId);
    }, [jobs, selectedJobId]);

    const hasNoShiftSlots = selectedJob
        ? selectedJob.shiftSlots.length === 0
        : false;

    const hasNoAssignedStaff = selectedJob
        ? selectedJob.shiftSlots.length > 0 &&
        selectedJob.shiftSlots.every(
            (slot) =>
                slot.shiftAssignments.length === 0 &&
                slot.externalStaffAssignments.length === 0,
        )
        : false;

    const assignedStaffCount = selectedJob
        ? selectedJob.shiftSlots.reduce((total, slot) => {
            const internalCount = slot.shiftAssignments.length;
            const externalCount = slot.externalStaffAssignments.reduce(
                (sum, assignment) => sum + assignment.headCount,
                0,
            );

            return total + internalCount + externalCount;
        }, 0)
        : 0;

    const handleOptionChange = (key: keyof GroupMessageOptions) => {
        setOptions((current) => ({
            ...current,
            [key]: !current[key],
        }));
        setCopied(false);
    };

    const handleGenerate = () => {
        if (!selectedJob || hasNoShiftSlots) {
            setMessage("");
            return;
        }

        const generatedMessage = generateGroupJobMessage({
            job: selectedJob,
            type: messageType,
            options,
        });

        setMessage(generatedMessage);
        setCopied(false);
    };

    useEffect(() => {
        if (!selectedJob || hasNoShiftSlots) {
            setMessage("");
            setCopied(false);
            return;
        }

        const generatedMessage = generateGroupJobMessage({
            job: selectedJob,
            type: messageType,
            options,
        });

        setMessage(generatedMessage);
        setCopied(false);
    }, [selectedJob, messageType, options, hasNoShiftSlots]);

    const handleCopy = async () => {
        if (!message) {
            return;
        }

        await navigator.clipboard.writeText(message);
        setCopied(true);
    };

    if (jobs.length === 0) {
        return (
            <AppCard className="p-6">
                <h2
                    className={[
                        appStyles.text.title,
                        "text-lg font-semibold",
                    ].join(" ")}
                >
                    案件グループ用メッセージ
                </h2>
                <p className={["mt-2", appStyles.text.muted].join(" ")}>
                    メッセージを作成できる案件がまだありません。
                </p>
            </AppCard>
        );
    }

    return (
        <div className="space-y-6">
            <AppCard className="p-6">
                <div className="flex items-center gap-3">
                    <div className={appStyles.icon.circle}>
                        <MessageSquareText className="h-5 w-5" />
                    </div>

                    <div>
                        <h2
                            className={[
                                appStyles.text.title,
                                "text-lg font-semibold",
                            ].join(" ")}
                        >
                            案件グループ用メッセージ
                        </h2>
                        <p className={["mt-1", appStyles.text.muted].join(" ")}>
                            案件ごとのLINEグループに送る確認文・詳細文を作成します。
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-3">
                    <form className="space-y-2">
                        <label htmlFor="month" className={appStyles.form.label}>
                            対象月
                        </label>
                        <input
                            id="month"
                            type="month"
                            name="month"
                            defaultValue={selectedMonth}
                            onChange={(event) => {
                                event.currentTarget.form?.requestSubmit();
                            }}
                            className={[
                                appStyles.form.input,
                                "h-11 w-full px-3 text-sm",
                            ].join(" ")}
                        />
                    </form>

                    <div className="space-y-2">
                        <label htmlFor="jobId" className={appStyles.form.label}>
                            案件
                        </label>
                        <select
                            id="jobId"
                            value={selectedJobId}
                            onChange={(event) => {
                                setSelectedJobId(event.target.value);
                                setMessage("");
                                setCopied(false);
                            }}
                            className={[
                                appStyles.form.input,
                                "h-11 w-full px-3 text-sm",
                            ].join(" ")}
                        >
                            {jobs.map((job) => (
                                <option key={job.id} value={job.id}>
                                    {`${job.workDate.getMonth() + 1}/${job.workDate.getDate()} ${job.title} / ${job.location}`}
                                </option>
                            ))}
                        </select>

                        {hasNoShiftSlots ? (
                            <WarningText>
                                この案件には勤務枠が登録されていません。
                            </WarningText>
                        ) : null}

                        {hasNoAssignedStaff ? (
                            <WarningText>
                                この案件にはまだ割当スタッフがいません。
                            </WarningText>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="messageType"
                            className={appStyles.form.label}
                        >
                            メッセージ種類
                        </label>
                        <select
                            id="messageType"
                            value={messageType}
                            onChange={(event) => {
                                setMessageType(event.target.value as GroupMessageType);
                                setMessage("");
                                setCopied(false);
                            }}
                            className={[
                                appStyles.form.input,
                                "h-11 w-full px-3 text-sm",
                            ].join(" ")}
                        >
                            <option value="scheduleConfirm">
                                スケジュール確認
                            </option>
                            <option value="detail">詳細連絡</option>
                        </select>
                    </div>
                </div>

                <div
                    className={[
                        "mt-6 grid gap-3 p-4 md:grid-cols-4",
                        appStyles.section.soft,
                    ].join(" ")}
                >
                    <SummaryItem
                        label="選択中の案件"
                        value={selectedJob?.title ?? "未選択"}
                    />

                    <SummaryItem
                        label="勤務枠数"
                        value={`${selectedJob?.shiftSlots.length ?? 0}件`}
                    />

                    <SummaryItem
                        label="割当人数"
                        value={`${assignedStaffCount}人`}
                    />

                    <SummaryItem
                        label="種類"
                        value={
                            messageType === "scheduleConfirm"
                                ? "確認"
                                : "詳細"
                        }
                    />
                </div>

                <div className="mt-6 space-y-3">
                    <p className={appStyles.form.label}>表示する項目</p>

                    <div className="grid gap-3 md:grid-cols-2">
                        {messageOptionItems.map((item) => {
                            const checked = options[item.key];

                            return (
                                <label
                                    key={item.key}
                                    className={[
                                        "flex cursor-pointer items-center gap-2 border px-3 py-2 text-sm transition",
                                        appStyles.radius.xl,
                                        checked
                                            ? [
                                                appStyles.border.accent,
                                                appStyles.background.warm,
                                                appStyles.textColor.default,
                                            ].join(" ")
                                            : [
                                                appStyles.border.soft,
                                                appStyles.background.white,
                                                appStyles.textColor.body,
                                                appStyles.tokens.color.background.hoverWarmSubtle,
                                            ].join(" "),
                                    ].join(" ")}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                            handleOptionChange(item.key)
                                        }
                                        className={[
                                            "h-4 w-4 rounded accent-current",
                                            appStyles.textColor.accent,
                                        ].join(" ")}
                                    />
                                    {item.label}
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        type="button"
                        onClick={handleGenerate}
                        disabled={!selectedJob || hasNoShiftSlots}
                        className={appStyles.button.primary}
                    >
                        <MessageSquareText className="mr-2 h-4 w-4" />
                        再生成
                    </Button>
                </div>
            </AppCard>

            <GeneratedMessagePanel
                message={message}
                copied={copied}
                onMessageChange={(value) => {
                    setMessage(value);
                    setCopied(false);
                }}
                onCopy={handleCopy}
            />
        </div>
    );
};

type WarningTextProps = {
    children: React.ReactNode;
};

const WarningText = ({ children }: WarningTextProps) => {
    return (
        <p className={["text-sm", appStyles.textColor.pending].join(" ")}>
            {children}
        </p>
    );
};

type SummaryItemProps = {
    label: string;
    value: string;
};

const SummaryItem = ({ label, value }: SummaryItemProps) => {
    return (
        <div>
            <p
                className={[
                    "text-xs font-medium",
                    appStyles.textColor.accent,
                ].join(" ")}
            >
                {label}
            </p>
            <p
                className={[
                    "mt-2 font-semibold",
                    appStyles.textColor.default,
                ].join(" ")}
            >
                {value}
            </p>
        </div>
    );
};