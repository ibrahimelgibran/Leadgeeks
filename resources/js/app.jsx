import "./bootstrap";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SubscriptionsIndex from "./Pages/Subscriptions/Index";
import CreateSubscription from "./Pages/Subscriptions/Create";
import EditSubscription from "./Pages/Subscriptions/Edit";
import NotFound from "./Pages/NotFound";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/subscriptions" replace />}
                />
                <Route path="/subscriptions" element={<SubscriptionsIndex />} />
                <Route
                    path="/subscriptions/create"
                    element={<CreateSubscription />}
                />
                <Route
                    path="/subscriptions/:id/edit"
                    element={<EditSubscription />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("app")).render(<App />);
