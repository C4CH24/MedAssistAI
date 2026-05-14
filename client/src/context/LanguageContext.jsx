import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");

    const toggleLanguage = () => {
        setLanguage(prev => prev === "en" ? "sw" : "en");
    };

    const t = (key) => {
        const translations = {
            en: {
                medications: "Medications",
                addMedication: "Add Medication",
                logout: "Logout",
                login: "Login",
                register: "Register",
                phoneNumber: "Phone Number",
                fullName: "Full Name",
                pin: "PIN",
                confirmPin: "Confirm PIN",
                language: "Language",
                english: "English",
                swahili: "Swahili",
                registerButton: "Register",
                alreadyHaveAccount: "Already have an account?",
                loginHere: "Login here",
                welcome: "Welcome to MedAssistAI",
                subtitle: "Your AI-Powered Healthcare Assistant"
            },
            sw: {
                medications: "Dawa",
                addMedication: "Ongeza Dawa",
                logout: "Toka",
                login: "Ingia",
                register: "Jisajili",
                phoneNumber: "Nambari ya Simu",
                fullName: "Jina Kamili",
                pin: "Nambari ya siri",
                confirmPin: "Thibitisha Nambari ya siri",
                language: "Lugha",
                english: "Kiingereza",
                swahili: "Kiswahili",
                registerButton: "Jisajili",
                alreadyHaveAccount: "Tayari una akaunti?",
                loginHere: "Ingia hapa",
                welcome: "Karibu MedAssistAI",
                subtitle: "Msaidizi wako wa Afya"
            }
        };
        return translations[language][key] || key;
    };

    const value = {
        language,
        toggleLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
