import React from "react";
import {
    translations,
    statusLabels as statusLabelsLookup,
} from "./translations";

const statusOptions = ["Active", "Expiring Soon", "Expired", "Cancelled"];

export default function Form({
    data,
    errors,
    onChange,
    onSubmit,
    saving,
    onCancel,
    language,
}) {
    const labels = translations[language] || translations.id;
    const statusLabels = statusLabelsLookup[language] || statusLabelsLookup.id;
    return (
        <form
            onSubmit={onSubmit}
            className="bg-white p-8 rounded-3xl shadow-sm ring-1 ring-slate-200 space-y-6"
        >
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {labels.toolNameLabel}
                    </label>
                    <input
                        type="text"
                        value={data.tool_name}
                        onChange={(e) => onChange("tool_name", e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                    {errors.tool_name && (
                        <p className="mt-1 text-sm text-rose-600">
                            {Array.isArray(errors.tool_name)
                                ? errors.tool_name[0]
                                : errors.tool_name}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {labels.departmentOwnerLabel}
                    </label>
                    <input
                        type="text"
                        value={data.department_owner}
                        onChange={(e) =>
                            onChange("department_owner", e.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                    {errors.department_owner && (
                        <p className="mt-1 text-sm text-rose-600">
                            {Array.isArray(errors.department_owner)
                                ? errors.department_owner[0]
                                : errors.department_owner}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {labels.renewalDateLabel}
                    </label>
                    <input
                        type="date"
                        value={data.renewal_date}
                        onChange={(e) =>
                            onChange("renewal_date", e.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                    {errors.renewal_date && (
                        <p className="mt-1 text-sm text-rose-600">
                            {Array.isArray(errors.renewal_date)
                                ? errors.renewal_date[0]
                                : errors.renewal_date}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {labels.monthlyCostLabel}
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.monthly_cost}
                        onChange={(e) =>
                            onChange("monthly_cost", e.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                    {errors.monthly_cost && (
                        <p className="mt-1 text-sm text-rose-600">
                            {Array.isArray(errors.monthly_cost)
                                ? errors.monthly_cost[0]
                                : errors.monthly_cost}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {labels.statusLabel}
                    </label>
                    <select
                        value={data.status}
                        onChange={(e) => onChange("status", e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>
                                {statusLabels[opt]}
                            </option>
                        ))}
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-rose-600">
                            {Array.isArray(errors.status)
                                ? errors.status[0]
                                : errors.status}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {language === "id" ? "Catatan" : "Notes"}
                </label>
                <textarea
                    value={data.notes}
                    onChange={(e) => onChange("notes", e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
                {errors.notes && (
                    <p className="mt-1 text-sm text-rose-600">
                        {Array.isArray(errors.notes)
                            ? errors.notes[0]
                            : errors.notes}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving ? labels.saving : labels.saveSubscription}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                >
                    {labels.cancel}
                </button>
            </div>
        </form>
    );
}
