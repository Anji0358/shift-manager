import { UnavailableTimeForm } from "@/features/unavailable-times/components/unavailable-time-form";

const StaffNewUnavailableTimePage = () => {
    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">NGの日時を登録</h1>

                <p className="mt-2 text-slate-600">
                    NGの日や時間を登録すると、管理者がスタッフを割り振るときの候補から外れます。
                    授業・予定・試験など、NGの日時を登録してください。
                </p>
            </section>

            <UnavailableTimeForm />
        </div>
    );
};

export default StaffNewUnavailableTimePage;