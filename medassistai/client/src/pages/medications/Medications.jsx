import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

// Custom Icons
const PillIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const DeleteIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const EditIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const Medications = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMedications();
    }, []);

    const fetchMedications = async () => {
        try {
            console.log("Fetching medications...");
            
            const response = await fetchWithAuth('/medications');

            console.log("Response status:", response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log("Received data:", data);
            
            // Handle different response formats
            let medicationsArray = [];
            if (Array.isArray(data)) {
                medicationsArray = data;
            } else if (data.success && Array.isArray(data.data)) {
                medicationsArray = data.data;
            } else if (data.medications && Array.isArray(data.medications)) {
                medicationsArray = data.medications;
            } else if (Array.isArray(data)) {
                medicationsArray = data;
            } else {
                console.warn("Unexpected data format:", data);
                medicationsArray = [];
            }
            
            setMedications(medicationsArray);
        } catch (error) {
            console.error("Error fetching medications:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteMedication = async (id) => {
        if (!confirm(language === "sw" ? "Je, una uhakika unataka kufuta dawa hii?" : "Are you sure you want to delete this medication?")) {
            return;
        }

        try {
            const response = await fetchWithAuth(`/medications/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setMedications(medications.filter(med => med._id !== id));
            } else {
                const error = await response.json();
                alert(error.message || "Failed to delete medication");
            }
        } catch (error) {
            console.error("Error deleting medication:", error);
            alert("Network error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">??</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Medications</h3>
                    <p className="text-gray-600">{error}</p>
                    <button 
                        onClick={fetchMedications}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {language === "sw" ? "Dawa Zangu" : "My Medications"}
                        </h1>
                        <p className="mt-2 text-gray-600">
                            {language === "sw" 
                                ? "Orodha ya dawa zako zote" 
                                : "List of all your medications"}
                        </p>
                    </div>
                    <Link
                        to="/add-medication"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <span className="text-xl mr-2">+</span>
                        {language === "sw" ? "Ongeza Dawa" : "Add Medication"}
                    </Link>
                </div>

                {/* Medications List */}
                {medications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                        <div className="flex justify-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <PillIcon />
                            </div>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            {language === "sw" ? "Hakuna Dawa" : "No Medications"}
                        </h3>
                        <p className="mt-2 text-gray-600">
                            {language === "sw" 
                                ? "Bado hujaongeza dawa yoyote. Bonyeza kitufe cha 'Ongeza Dawa' kuanza." 
                                : "You haven't added any medications yet. Click 'Add Medication' to get started."}
                        </p>
                        <Link
                            to="/add-medication"
                            className="inline-flex items-center px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {language === "sw" ? "Ongeza Dawa Yako ya Kwanza" : "Add Your First Medication"}
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {medications.map((med) => (
                            <div key={med._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <PillIcon />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{med.name}</h3>
                                            <p className="text-gray-600 mt-1">{med.dosage}</p>
                                            {med.conditionTreated && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {language === "sw" ? "Hali" : "Condition"}: {med.conditionTreated}
                                                </p>
                                            )}
                                            <div className="flex items-center space-x-4 mt-2">
                                                <span className="text-sm text-gray-500">
                                                    {language === "sw" ? "Mara" : "Frequency"}: {med.frequency}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {language === "sw" ? "Muda" : "Time"}: {med.time || "08:00"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => deleteMedication(med._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title={language === "sw" ? "Futa" : "Delete"}
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Medications;
