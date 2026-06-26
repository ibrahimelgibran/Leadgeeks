import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { statusOptions } from "./statusOptions";
import { translations, statusLabels, localeByLanguage } from "./translations";
const statusClasses = {
    Active: "bg-emerald-100 text-emerald-800",
    "Expiring Soon": "bg-amber-100 text-amber-800",
    Expired: "bg-rose-100 text-rose-800",
    Cancelled: "bg-slate-200 text-slate-800",
};

function formatCurrency(value) {
    const amount = Number(value || 0);
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(isNaN(amount) ? 0 : amount);
}

function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

function getRenewalAlert(dateString, language) {
    if (!dateString) return null;

    const today = new Date();
    const renewal = new Date(dateString);
    const diffMs = renewal.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return {
            label: translations[language].expired,
            className: "bg-rose-50 text-rose-700",
        };
    }

    if (diffDays <= 7) {
        return {
            label: translations[language].dueInDays(diffDays),
            className: "bg-amber-50 text-amber-700",
        };
    }

    return null;
}

export default function SubscriptionsIndex() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [language, setLanguage] = useState(searchParams.get("lang") || "id");
    const [subscriptions, setSubscriptions] = useState(null);
    const [dashboard, setDashboard] = useState({
        total: 0,
        active: 0,
        expiring: 0,
        expired: 0,
    });
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setStatus(searchParams.get("status") || "");
        setLanguage(searchParams.get("lang") || "id");
    }, [searchParams]);

    useEffect(() => {
        fetchSubscriptions();
    }, [searchParams]);

    const fetchSubscriptions = async () => {
        setLoading(true);

        try {
            const params = {
                search: searchParams.get("search") || "",
                status: searchParams.get("status") || "",
                lang: language,
            };

            const page = searchParams.get("page");
            if (page) params.page = page;

            const { data } = await axios.get("/subscriptions", { params });

            setSubscriptions(data.subscriptions);
            setDashboard(data.dashboard);
        } catch (error) {
            console.error(error);
            setSubscriptions({ data: [], links: [], from: 0, to: 0, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (event) => {
        event.preventDefault();

        const params = {};
        if (search) params.search = search;
        if (status) params.status = status;
        if (language) params.lang = language;

        setSearchParams(params);
    };

    const exportCsv = () => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (language) params.set("lang", language);

        window.location.href = `/api/subscriptions/export?${params.toString()}`;
    };

    const goToPage = (link) => {
        if (!link.url) {
            return;
        }

        const url = new URL(link.url, window.location.origin);
        const params = Object.fromEntries(url.searchParams.entries());
        if (language) params.lang = language;
        setSearchParams(params);
    };

    const deleteSubscription = async (id) => {
        if (!window.confirm(translations[language].deleteConfirm)) {
            return;
        }

        try {
            await axios.delete(`/subscriptions/${id}`);
            fetchSubscriptions();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading || subscriptions === null) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <p className="text-sm text-slate-500">
                        {translations[language].loading}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-500">
                            {translations[language].dashboard}
                        </p>
                        <h1 className="text-3xl font-semibold text-slate-900">
                            {translations[language].pageTitle}
                        </h1>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-700">
                                {translations[language].languageLabel}:
                            </label>
                            <select
                                value={language}
                                onChange={(e) => {
                                    const lang = e.target.value;
                                    setLanguage(lang);
                                    const params = Object.fromEntries(
                                        searchParams.entries(),
                                    );
                                    params.lang = lang;
                                    setSearchParams(params);
                                }}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none"
                            >
                                <option value="id">Indonesia</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/subscriptions/create?lang=${language}`,
                                )
                            }
                            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
                        >
                            {translations[language].addSubscription}
                        </button>
                        <button
                            type="button"
                            onClick={exportCsv}
                            className="inline-flex items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-200"
                        >
                            {translations[language].exportCsv}
                        </button>
                    </div>
                </header>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm text-slate-500">
                            {translations[language].totalSubscriptions ||
                                "Total subscriptions"}
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">
                            {dashboard.total}
                        </p>
                    </div>
                    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm text-slate-500">
                            {translations[language].active || "Active"}
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">
                            {dashboard.active}
                        </p>
                    </div>
                    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm text-slate-500">
                            {translations[language].expiringSoon ||
                                "Expiring Soon"}
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">
                            {dashboard.expiring}
                        </p>
                    </div>
                    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm text-slate-500">
                            {translations[language].expired || "Expired"}
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">
                            {dashboard.expired}
                        </p>
                    </div>
                </section>

                <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <form
                        onSubmit={applyFilters}
                        className="grid gap-4 md:grid-cols-3"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                {translations[language].searchLabel}
                            </label>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                type="search"
                                placeholder={
                                    translations[language].searchPlaceholder
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-1 ring-transparent transition focus:border-slate-400 focus:ring-slate-300"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                {translations[language].statusLabel}
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-1 ring-transparent transition focus:border-slate-400 focus:ring-slate-300"
                            >
                                <option value="">
                                    {translations[language].allStatuses}
                                </option>
                                {statusOptions.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
                            >
                                {translations[language].apply}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        {translations[language].toolHeader}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        {
                                            translations[language]
                                                .departmentHeader
                                        }
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        {translations[language].renewalHeader}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        {translations[language].monthlyHeader}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        {translations[language].statusHeader}
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        {translations[language].actionsHeader}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {subscriptions.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-sm text-slate-500"
                                        >
                                            {
                                                translations[language]
                                                    .noSubscriptions
                                            }
                                        </td>
                                    </tr>
                                ) : (
                                    subscriptions.data.map((subscription) => {
                                        const alert = getRenewalAlert(
                                            subscription.renewal_date,
                                            language,
                                        );

                                        return (
                                            <tr key={subscription.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                                    {subscription.tool_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {
                                                        subscription.department_owner
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    <div>
                                                        {formatDate(
                                                            subscription.renewal_date,
                                                        )}
                                                    </div>
                                                    {alert ? (
                                                        <span
                                                            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${alert.className}`}
                                                        >
                                                            {alert.label}
                                                        </span>
                                                    ) : null}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {formatCurrency(
                                                        subscription.monthly_cost,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[subscription.status] || "bg-slate-100 text-slate-700"}`}
                                                    >
                                                        {statusLabels[
                                                            language
                                                        ]?.[
                                                            subscription.status
                                                        ] ||
                                                            subscription.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/subscriptions/${subscription.id}/edit?lang=${language}`,
                                                            )
                                                        }
                                                        className="mr-3 text-slate-700 hover:text-slate-900"
                                                    >
                                                        {
                                                            translations[
                                                                language
                                                            ].edit
                                                        }
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteSubscription(
                                                                subscription.id,
                                                            )
                                                        }
                                                        className="text-rose-600 hover:text-rose-800"
                                                    >
                                                        {
                                                            translations[
                                                                language
                                                            ].delete
                                                        }
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-600">
                                {translations[language].showing}{" "}
                                {subscriptions.from}-{subscriptions.to}{" "}
                                {translations[language].showingOf}{" "}
                                {subscriptions.total}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {subscriptions.links.map((link, index) => {
                                    const isActive = link.active;
                                    const buttonClass = isActive
                                        ? "bg-slate-900 text-white"
                                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100";
                                    const disabledClass = link.url
                                        ? ""
                                        : "disabled:cursor-not-allowed disabled:opacity-50";

                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            disabled={!link.url}
                                            onClick={() => goToPage(link)}
                                            className={`rounded-xl px-3 py-2 text-sm ${buttonClass} ${disabledClass}`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
