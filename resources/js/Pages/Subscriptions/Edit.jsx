import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import Form from "./Form";
import { translations } from "./translations";

export default function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [language, setLanguage] = useState(searchParams.get("lang") || "id");
    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setLanguage(searchParams.get("lang") || "id");
        const fetchSubscription = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/subscriptions/${id}`);
                let renewalDate = data.subscription.renewal_date;
                if (renewalDate) {
                    const date = new Date(renewalDate);
                    renewalDate = date.toISOString().split("T")[0];
                }
                setFormData({
                    tool_name: data.subscription.tool_name,
                    department_owner: data.subscription.department_owner,
                    renewal_date: renewalDate,
                    monthly_cost: data.subscription.monthly_cost,
                    status: data.subscription.status,
                    notes: data.subscription.notes || "",
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscription();
    }, [id, searchParams]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            await axios.put(`/subscriptions/${id}`, formData);
            navigate(`/subscriptions?lang=${language}`);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                console.error(error);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setFormData((current) => ({ ...current, [key]: value }));
    };

    if (loading || formData === null) {
        return React.createElement(
            "div",
            { className: "p-8" },
            translations[language].loading,
        );
    }

    return React.createElement(
        "div",
        { className: "p-8 bg-slate-50 min-h-screen" },
        React.createElement(
            "div",
            { className: "mx-auto max-w-4xl" },
            React.createElement(
                "p",
                { className: "text-sm text-gray-500" },
                translations[language].editSubtitle,
            ),
            React.createElement(
                "h1",
                { className: "text-3xl font-bold mb-6" },
                translations[language].editHeader,
            ),
            React.createElement(Form, {
                data: formData,
                errors: errors,
                onChange: handleChange,
                onSubmit: handleSubmit,
                saving: saving,
                onCancel: () => navigate(`/subscriptions?lang=${language}`),
                language: language,
            }),
        ),
    );
}
