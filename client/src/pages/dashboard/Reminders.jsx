import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

// Custom Icons
const ClockIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const BellIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const CheckIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const PlusIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const DeleteIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const Reminders = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, completed

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            const response = await fetchWithAuth('/reminders');
            if (response.ok) {
                const data = await response.json();
                setReminders(Array.isArray(data) ? data : (data.data || []));
            }
        } catch (error) {
            console.error("Failed to fetch reminders:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsComplete = async (reminderId) => {
        try {
            const response = await fetchWithAuth(`/reminders/${reminderId}/complete`, {
                method: 'PUT'
            });
            if (response.ok) {
                setReminders(reminders.map(r => 
                    r._id === reminderId ? { ...r, completed: true } : r
                ));
            }
        } catch (error) {
            console.error("Failed to mark reminder as complete:", error);
        }
    };

    const deleteReminder = async (reminderId) => {
        if (!confirm(language === "sw" ? "Je, una uhakika unataka kufuta kumbukumbu hii?" : "Are you sure you want to delete this reminder?")) {
            return;
        }

        try {
            const response = await fetchWithAuth(`/reminders/${reminderId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setReminders(reminders.filter(r => r._id !== reminderId));
            }
        } catch (error) {
            console.error("Failed to delete reminder:", error);
        }
    };

    const filteredReminders = reminders.filter(reminder => {
        if (filter === 'active') return !reminder.completed;
        if (filter === 'completed') return reminder.completed;
        return true;
    });

    const activeCount = reminders.filter(r => !r.completed).length;
    const completedCount = reminders.filter(r => r.completed).length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                            {language === "sw" ? "Vikumbusho Vyangu" : "My Reminders"}
                        </h1>
                        <p className="mt-2 text-gray-600">
                            {language === "sw" 
                                ? "Dhibiti vikumbusho vya dawa zako" 
                                : "Manage your medication reminders"}
                        </p>
                    </div>
                    <Link
                        to="/add-medication"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PlusIcon />
                        <span className="ml-2">{language === "sw" ? "Ongeza Dawa" : "Add Medication"}</span>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <BellIcon />
                            </div>
                            <span className="text-sm font-medium text-blue-600">
                                {language === "sw" ? "Jumla" : "Total"}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {reminders.length}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {language === "sw" ? "Vikumbusho Vyote" : "All Reminders"}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <ClockIcon />
                            </div>
                            <span className="text-sm font-medium text-green-600">
                                {language === "sw" ? "Viko Hai" : "Active"}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {activeCount}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {language === "sw" ? "Vikumbusho Viko Hai" : "Active Reminders"}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <CheckIcon />
                            </div>
                            <span className="text-sm font-medium text-purple-600">
                                {language === "sw" ? "Kumekamilika" : "Completed"}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {completedCount}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {language === "sw" ? "Vilivyokamilika" : "Completed"}
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setFilter('all')}
                            className={`flex-1 px-6 py-4 text-sm font-medium ${
                                filter === 'all'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {language === "sw" ? "Zote" : "All"}
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`flex-1 px-6 py-4 text-sm font-medium ${
                                filter === 'active'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {language === "sw" ? "Viko Hai" : "Active"}
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`flex-1 px-6 py-4 text-sm font-medium ${
                                filter === 'completed'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {language === "sw" ? "Vilivyokamilika" : "Completed"}
                        </button>
                    </div>
                </div>

                {/* Reminders List */}
                {filteredReminders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                        <div className="flex justify-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <BellIcon />
                            </div>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            {language === "sw" ? "Hakuna Vikumbusho" : "No Reminders"}
                        </h3>
                        <p className="mt-2 text-gray-600">
                            {language === "sw" 
                                ? "Huna vikumbusho vya dawa. Ongeza dawa kuanza." 
                                : "You don't have any medication reminders yet. Add medications to get started."}
                        </p>
                        <Link
                            to="/add-medication"
                            className="inline-flex items-center px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {language === "sw" ? "Ongeza Dawa" : "Add Medication"}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReminders.map((reminder) => (
                            <div
                                key={reminder._id}
                                className={`bg-white rounded-xl shadow-sm p-6 border ${
                                    reminder.completed
                                        ? 'border-gray-200 opacity-75'
                                        : 'border-gray-100 hover:shadow-md'
                                } transition-shadow`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className={`p-3 rounded-lg ${
                                            reminder.completed ? 'bg-green-100' : 'bg-blue-100'
                                        }`}>
                                            {reminder.completed ? <CheckIcon /> : <ClockIcon />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {reminder.medicationName || reminder.name || 'Medication Reminder'}
                                            </h3>
                                            <p className="text-gray-600 mt-1">
                                                {reminder.dosage || reminder.description || ''}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <span className="text-sm text-gray-500">
                                                    {language === "sw" ? "Muda" : "Time"}: {reminder.time || '08:00'}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {language === "sw" ? "Kila" : "Every"}: {reminder.frequency || 'Daily'}
                                                </span>
                                                {reminder.completed && (
                                                    <span className="text-sm text-green-600 font-medium">
                                                        {language === "sw" ? "Imekamilika" : "Completed"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        {!reminder.completed && (
                                            <button
                                                onClick={() => markAsComplete(reminder._id)}
                                                className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                                                title={language === "sw" ? "Mark Kamili" : "Mark Complete"}
                                            >
                                                <CheckIcon />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteReminder(reminder._id)}
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

export default Reminders;
