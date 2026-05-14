import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { API_BASE_URL } from "../../utils/constants";

// Custom SVG Icons (no external dependencies needed)
const PillIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SparklesIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const PlusIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const ListBulletIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const InformationCircleIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ExclamationTriangleIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const Dashboard = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiStatus, setAiStatus] = useState("primary");
    const [aiTip, setAiTip] = useState("");
    const [showAITip, setShowAITip] = useState(true);
    const [stats, setStats] = useState({
        todayCount: 3,
        adherenceRate: 85,
        remindersCount: 3
    });

    const todayMeds = [
        { id: 1, name: "Metformin", dosage: "500mg", time: "08:00", taken: false },
        { id: 2, name: "Lisinopril", dosage: "10mg", time: "08:00", taken: false },
        { id: 3, name: "Amlodipine", dosage: "5mg", time: "08:00", taken: false }
    ];

    useEffect(() => {
        fetchMedications();
        checkAIStatus();
        getAITip();
    }, []);

    const fetchMedications = async () => {
        try {
            const response = await fetchWithAuth('/medications');
            if (response.ok) {
                const data = await response.json();
                setMedications(data);
            }
        } catch (error) {
            console.error("Failed to fetch medications:", error);
        } finally {
            setLoading(false);
        }
    };

    const checkAIStatus = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/ai/health`);
            const data = await response.json();
            if (data.fadhili?.available) setAiStatus("primary");
            else if (data.gemini?.available) setAiStatus("fallback");
            else setAiStatus("offline");
        } catch (error) {
            console.error("Failed to check AI status:", error);
        }
    };

    const getAITip = async () => {
        try {
            const response = await fetchWithAuth('/ai/process', {
                method: "POST",
                body: JSON.stringify({
                    query: "Give me a health tip for today",
                    type: "tip",
                    context: { language: language || "en" }
                })
            });
            const data = await response.json();
            if (data.success) {
                setAiTip(data.data?.text || (language === "sw" 
                    ? "Kumbuka kunywa maji mengi leo" 
                    : "Remember to stay hydrated today"));
            }
        } catch (error) {
            console.error("Failed to get AI tip:", error);
            setAiTip(language === "sw" 
                ? "Kumbuka kuchukua dawa zako kwa wakati" 
                : "Remember to take your medications on time");
        }
    };

    const markAsTaken = (medId) => {
        console.log("Mark medication as taken:", medId);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* AI Status Banner */}
            {aiStatus !== "primary" && (
                <div className={`${
                    aiStatus === "fallback" 
                        ? "bg-yellow-50 border-yellow-200 text-yellow-800" 
                        : "bg-red-50 border-red-200 text-red-800"
                } border-l-4 p-4 mb-6 mx-6 mt-6 rounded-lg`}>
                    <div className="flex items-center">
                        <InformationCircleIcon />
                        <p className="font-medium ml-2">
                            {aiStatus === "fallback" 
                                ? (language === "sw" ? "Fadhili AI haipatikani kwa muda. Inatumia backup." : "Fadhili AI temporarily unavailable. Using backup.")
                                : (language === "sw" ? "Huduma za AI hazipo. Inatumia vikumbusho vya kawaida." : "AI services offline. Using basic reminders.")}
                        </p>
                    </div>
                </div>
            )}

            {/* AI Tip Banner */}
            {showAITip && aiTip && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 mx-6 mt-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <SparklesIcon />
                            <p className="text-blue-700 ml-2">{aiTip}</p>
                        </div>
                        <button 
                            onClick={() => setShowAITip(false)}
                            className="text-blue-500 hover:text-blue-700 text-xl"
                        >
                            �
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {language === "sw" ? "Karibu" : "Welcome"}, {user?.fullName || "User"}!
                        </h1>
                        <p className="mt-2 text-gray-600">
                            {language === "sw" 
                                ? "Hapa ndipo utakapoona dawa zako na vikumbusho" 
                                : "Here's your medication overview for today"}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                        <SparklesIcon />
                        <span className="text-sm font-medium text-gray-700">
                            {aiStatus === "primary" 
                                ? (language === "sw" ? "Fadhili AI Imewashwa" : "Fadhili AI Active")
                                : (language === "sw" ? "Kutumia Backup" : "Using Backup")}
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <PillIcon />
                            </div>
                            <span className="text-sm font-medium text-blue-600">
                                {language === "sw" ? "Leo" : "Today"}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.todayCount}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {language === "sw" ? "Dawa za Leo" : "Today's Medications"}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircleIcon />
                            </div>
                            <span className="text-sm font-medium text-green-600">
                                {aiStatus === "primary" ? "Fadhili AI" : "Backup"}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.adherenceRate}%
                        </h3>
                        <p className="text-sm text-gray-600">
                            {language === "sw" ? "Kiwango cha Ufuataji" : "Adherence Rate"}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <ClockIcon />
                            </div>
                            <span className="text-sm font-medium text-purple-600">
                                {language === "sw" ? "Zimesalia" : "Remaining"}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.remindersCount}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {language === "sw" ? "Vikumbusho" : "Reminders"}
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {language === "sw" ? "Vitendo" : "Quick Actions"}
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/add-medication"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusIcon />
                            <span className="ml-2">{language === "sw" ? "Ongeza Dawa" : "Add Medication"}</span>
                        </Link>
                        <Link
                            to="/medications"
                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <ListBulletIcon />
                            <span className="ml-2">{language === "sw" ? "Dawa Zangu" : "My Medications"}</span>
                        </Link>
                    </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {language === "sw" ? "Ratiba ya Leo" : "Today's Schedule"}
                        </h2>
                    </div>
                    <div className="p-6">
                        {todayMeds.length > 0 ? (
                            <div className="space-y-4">
                                {todayMeds.map((med) => (
                                    <div key={med.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <PillIcon />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{med.name}</p>
                                                <p className="text-sm text-gray-600">{med.dosage}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-lg font-semibold text-blue-600">{med.time}</span>
                                            <button 
                                                onClick={() => markAsTaken(med.id)}
                                                className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                            >
                                                {language === "sw" ? "Nimekunywa" : "Taken"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                {language === "sw" 
                                    ? "Hakuna dawa zilizopangwa kwa leo" 
                                    : "No medications scheduled for today"}
                            </p>
                        )}
                    </div>
                </div>

                {/* AI Health Tip Section */}
                <div className="mt-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center mb-4">
                        <SparklesIcon />
                        <h3 className="text-lg font-semibold ml-2">
                            {language === "sw" ? "Kidokezo cha Afya" : "AI Health Tip"}
                        </h3>
                    </div>
                    <p className="text-blue-50">
                        {aiTip || (language === "sw" 
                            ? "Kumbuka kuchukua dawa zako kwa wakati na kunywa maji mengi." 
                            : "Remember to take your medications on time and stay hydrated.")}
                    </p>
                    <p className="text-sm text-blue-200 mt-4">
                        {language === "sw" 
                            ? "Kidokezo hiki kimetolewa na Fadhili AI" 
                            : "Powered by Fadhili AI"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
