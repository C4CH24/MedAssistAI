import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { API_BASE_URL } from "../../utils/constants";
import "./Auth.css";

const Register = () => {
    const [formData, setFormData] = useState({
        phoneNumber: "",
        fullName: "",
        pin: "",
        confirmPin: "",
        language: "en"
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

        if (formData.pin !== formData.confirmPin) {
            setError("PINs do not match");
            return;
        }

        if (formData.pin.length !== 6) {
            setError("PIN must be 6 digits");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phoneNumber: formData.phoneNumber,
                    fullName: formData.fullName,
                    pin: formData.pin,
                    language: formData.language,
                    dataConsent: true  // required for registration
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Show success message
                alert("Registration successful! Check server console for PIN.");
                navigate("/login");
            } else {
                const message = data.error || (Array.isArray(data.errors) ? data.errors[0]?.msg : null) || "Registration failed";
                setError(message);
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
                    <h1>{t("register")}</h1>
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
                        <label>{t("fullName")}</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
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

                    <div className="form-group">
                        <label>{t("confirmPin")}</label>
                        <input
                            type="password"
                            name="confirmPin"
                            value={formData.confirmPin}
                            onChange={handleChange}
                            placeholder="������"
                            required
                            maxLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label>{t("language")}</label>
                        <select
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                        >
                            <option value="en">{t("english")}</option>
                            <option value="sw">{t("swahili")}</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        disabled={loading}
                    >
                        {loading ? "..." : t("registerButton")}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {t("alreadyHaveAccount")}{" "}
                        <Link to="/login">{t("loginHere")}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
