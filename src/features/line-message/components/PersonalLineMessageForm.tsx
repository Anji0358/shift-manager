"use client";

import { useState } from "react";

type PersonalLineMessageFormProps = {
    selectedMonth: string;
    employees: {
        id: string;
        name: string;
    }[];
};

export const PersonalLineMessageForm = ({
    selectedMonth,
    employees,
}: PersonalLineMessageFormProps) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(
        employees[0]?.id ?? ""
    );

    if (employees.length === 0) {
        return (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">個人依頼文</h2>
                <p className="mt-2 text-sm text-slate-500">
                    依頼文を作成できる有効なスタッフがいません。
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">個人依頼文</h2>
            <p className="mt-2 text-sm text-slate-500">
                スタッフのNG日時と重複しない案件を選び、個人LINEに送る依頼文を作成します。
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">対象月</label>
                    <input
                        type="month"
                        value={selectedMonth}
                        readOnly
                        className="w-full rounded-xl border bg-slate-100 px-3 py-2 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">スタッフ</label>
                    <select
                        value={selectedEmployeeId}
                        onChange={(event) =>
                            setSelectedEmployeeId(event.target.value)
                        }
                        className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                    >
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};