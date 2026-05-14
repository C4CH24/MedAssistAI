import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

const AddMedication = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [interactions, setInteractions] = useState(null);
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        dosage: "",
        frequency: "daily",
        time: "08:00",
        startDate: new Date().toISOString().split("T")[0],
        conditionTreated: "",
        notes: ""
    });

    const frequencies = [
        { value: "daily", labelEn: "Once daily", labelSw: "Mara moja kwa siku" },
        { value: "twice_daily", labelEn: "Twice daily", labelSw: "Mara mbili kwa siku" },
        { value: "three_times", labelEn: "Three times daily", labelSw: "Mara tatu kwa siku" },
        { value: "weekly", labelEn: "Weekly", labelSw: "Kila wiki" }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const checkInteractions = async () => {
        if (!formData.name) return;
        
        try {
            const response = await fetchWithAuth('/ai/process', {
                method: "POST",
                body: JSON.stringify({
                    query: `Check interactions for ${formData.name}`,
                    type: "interaction",
                    context: { language }
                })
            });
            const data = await response.json();
            if (data.success && data.data?.interactions) {
                setInteractions(data.data.interactions);
            }
        } catch (error) {
            console.error("Error checking interactions:", error);
        }
    };

    const getAISuggestion = async () => {
        try {
            const response = await fetchWithAuth('/ai/process', {
                method: "POST",
                body: JSON.stringify({
                    query: `Suggest optimal timing for ${formData.name}`,
                    type: "suggestion",
                    context: { 
                        language,
                        medication: formData.name,
                        condition: formData.conditionTreated
                    }
                })
            });
            const data = await response.json();
            if (data.success && data.data?.text) {
                setAiSuggestion(data.data.text);
            }
        } catch (error) {
            console.error("Error getting AI suggestion:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetchWithAuth('/medications', {
                method: "POST",
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                navigate("/medications");
            } else {
                const error = await response.json();
                alert(error.message || "Failed to add medication");
            }
        } catch (error) {
            console.error("Error adding medication:", error);
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {language === "sw" ? "Ongeza Dawa Mpya" : "Add New Medication"}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {language === "sw" 
                            ? "Jaza maelezo ya dawa yako hapa chini" 
                            : "Fill in your medication details below"}
                    </p>

                    {/* AI Suggestion Banner */}
                    {aiSuggestion && (
                        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <p className="text-blue-700">{aiSuggestion}</p>
                        </div>
                    )}

                    {/* Interaction Warning */}
                    {interactions && interactions.length > 0 && (
                        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                            <h3 className="font-semibold text-yellow-800">
                                {language === "sw" ? "Onyo la Mwingiliano" : "Interaction Warning"}
                            </h3>
                            {interactions.map((interaction, idx) => (
                                <p key={idx} className="text-yellow-700 mt-1">{interaction}</p>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === "sw" ? "Jina la Dawa" : "Medication Name"} *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={checkInteractions}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Metformin"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === "sw" ? "Kipimo" : "Dosage"} *
                            </label>
                            <input
                                type="text"
                                name="dosage"
                                value={formData.dosage}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 500mg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === "sw" ? "Mara" : "Frequency"} *
                            </label>
                            <select
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {frequencies.map(freq => (
                                    <option key={freq.value} value={freq.value}>
                                        {language === "sw" ? freq.labelSw : freq.labelEn}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === "sw" ? "Muda wa Kuchukua" : "Time to Take"}
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === "sw" ? "Hali Inayotibiwa" : "Condition Treated"}
                            </label>
                            <input
                                type="text"
                                name="conditionTreated"
                                value={formData.conditionTreated}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Diabetes"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === "sw" ? "Maelezo" : "Notes"}
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={getAISuggestion}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {language === "sw" ? "Pendekezo la AI" : "Get AI Suggestion"}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "..." : (language === "sw" ? "Ongeza Dawa" : "Add Medication")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMedication;
