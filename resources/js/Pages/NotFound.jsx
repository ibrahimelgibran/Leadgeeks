import React from "react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-semibold text-slate-900">
                    Page Not Found
                </h1>
                <p className="mt-4 text-sm text-slate-600">
                    The page you are looking for does not exist.
                </p>
                <a
                    href="/subscriptions"
                    className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
                >
                    Go back to subscriptions
                </a>
            </div>
        </div>
    );
}
