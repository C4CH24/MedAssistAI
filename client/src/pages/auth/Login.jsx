import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { API_BASE_URL } from "../../utils/constants";
import "./Auth.css";

const Login = () => {
    const [formData, setFormData] = useState({
        phoneNumber: "",
        pin: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user, data.token);
                navigate("/");
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="language-selector">
                    <button onClick={toggleLanguage}>
                        {language === "en" ? "Kiswahili" : "English"}
                    </button>
                </div>
                
                <div className="auth-header">
                    <h1>{t("welcome")}</h1>
                    <p>{t("subtitle")}</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t("phoneNumber")}</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="712345678"
                            required
                            pattern="[0-9]{9}"
                        />
                    </div>

                    <div className="form-group">
                        <label>{t("pin")}</label>
                        <input
                            type="password"
                            name="pin"
                            value={formData.pin}
                            onChange={handleChange}
                            placeholder="������"
                            required
                            maxLength="6"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        disabled={loading}
                    >
                        {loading ? "..." : t("login")}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {t("dontHaveAccount")}{" "}
                        <Link to="/register">{t("registerHere")}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
