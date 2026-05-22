"use client";

import { useMemo, useState } from "react";
import { Copy, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateGroupJobMessage } from "../message-generators";
import type { GroupMessageOptions, GroupMessageType } from "../types";

const sampleJobs = [
    {
        id: "sample-job-1",
        title: "テスト案件",
        workDate: new Date("2026-05-20T00:00:00"),
        location: "横浜駅",
        meetingPlace: "〒220-0005 神奈川県横浜市西区南幸1丁目10-16",
        dressCode:
            "白ギャルソンスタイル\n白Yシャツ、黒スラックス、黒革靴(パンプスOK)、黒ネクタイ、黒ベルト、ベスト、タブリエ、黒靴下(くるぶしソックスNG、女性はストッキングOK)",
        belongings: "・白手\n・メモ帳\n・ボールペン",
        note: "各入り時間の10分前に集合場所に着くようにお願いします",
        shiftSlots: [
            {
                id: "sample-slot-1",
                startTime: new Date("2026-05-20T10:00:00"),
                endTime: new Date("2026-05-20T14:00:00"),
                assignments: [
                    {
                        employee: {
                            name: "スタッフA",
                        },
                    },
                ],
            },
            {
                id: "sample-slot-2",
                startTime: new Date("2026-05-20T10:00:00"),
                endTime: new Date("2026-05-20T15:00:00"),
                assignments: [
                    {
                        employee: {
                            name: "スタッフB",
                        },
                    },
                    {
                        employee: {
                            name: "スタッフC",
                        },
                    },
                    {
                        employee: {
                            name: "スタッフD",
                        },
                    },
                ],
            },
        ],
    },
];

export const GroupJobMessageForm = () => {
    const [selectedJobId, setSelectedJobId] = useState(sampleJobs[0]?.id ?? "");
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
        return sampleJobs.find((job) => job.id === selectedJobId);
    }, [selectedJobId]);

    const handleOptionChange = (key: keyof GroupMessageOptions) => {
        setOptions((current) => ({
            ...current,
            [key]: !current[key],
        }));
    };

    const handleGenerate = () => {
        if (!selectedJob) {
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

    const handleCopy = async () => {
        if (!message) {
            return;
        }

        await navigator.clipboard.writeText(message);
        setCopied(true);
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3">
                        <MessageSquareText className="h-5 w-5 text-slate-700" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">
                            案件グループ用メッセージ
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            案件ごとのLINEグループに送る確認文・詳細文を作成します。
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">案件</label>
                        <select
                            value={selectedJobId}
                            onChange={(event) => setSelectedJobId(event.target.value)}
                            className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                        >
                            {sampleJobs.map((job) => (
                                <option key={job.id} value={job.id}>
                                    {job.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            メッセージ種類
                        </label>
                        <select
                            value={messageType}
                            onChange={(event) =>
                                setMessageType(event.target.value as GroupMessageType)
                            }
                            className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                        >
                            <option value="scheduleConfirm">
                                スケジュール確認
                            </option>
                            <option value="detail">詳細連絡</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <p className="text-sm font-medium">表示する項目</p>

                    <div className="grid gap-3 md:grid-cols-2">
                        <label className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm">
                            <input
                                type="checkbox"
                                checked={options.includeMeetingPlace}
                                onChange={() => handleOptionChange("includeMeetingPlace")}
                            />
                            集合場所を含める
                        </label>

                        <label className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm">
                            <input
                                type="checkbox"
                                checked={options.includeDressCode}
                                onChange={() => handleOptionChange("includeDressCode")}
                            />
                            服装を含める
                        </label>

                        <label className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm">
                            <input
                                type="checkbox"
                                checked={options.includeBelongings}
                                onChange={() => handleOptionChange("includeBelongings")}
                            />
                            持ち物を含める
                        </label>

                        <label className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm">
                            <input
                                type="checkbox"
                                checked={options.includeNote}
                                onChange={() => handleOptionChange("includeNote")}
                            />
                            備考を含める
                        </label>
                    </div>
                </div>

                <div className="mt-6">
                    <Button type="button" onClick={handleGenerate}>
                        文章生成
                    </Button>
                </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h3 className="font-semibold">生成結果</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            必要に応じて編集してからコピーできます。
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCopy}
                        disabled={!message}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        {copied ? "コピー済み" : "コピー"}
                    </Button>
                </div>

                <textarea
                    value={message}
                    onChange={(event) => {
                        setMessage(event.target.value);
                        setCopied(false);
                    }}
                    placeholder="ここに生成されたメッセージが表示されます。"
                    className="mt-4 min-h-96 w-full rounded-xl border bg-slate-50 p-4 text-sm leading-7"
                />
            </div>
        </div>
    );
};