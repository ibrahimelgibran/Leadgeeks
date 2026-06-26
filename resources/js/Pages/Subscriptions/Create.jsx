import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Form from "./Form";
import { translations } from "./translations";

const statusOptions = ["Active", "Expiring Soon", "Expired", "Cancelled"];

export default function Create() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [language, setLanguage] = useState(searchParams.get("lang") || "id");
    const [formData, setFormData] = useState({
        tool_name: "",
        department_owner: "",
        renewal_date: "",
        monthly_cost: "",
        status: "Active",
        notes: "",
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            await axios.post("/subscriptions", formData);
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

    return React.createElement(
        "div",
        { className: "p-8 bg-slate-50 min-h-screen" },
        React.createElement(
            "div",
            { className: "mx-auto max-w-4xl" },
            React.createElement(
                "p",
                { className: "text-sm text-gray-500" },
                translations[language].createSubtitle,
            ),
            React.createElement(
                "h1",
                { className: "text-3xl font-bold mb-6" },
                translations[language].createHeader,
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
