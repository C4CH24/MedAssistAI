import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

// Custom Icons
const UserIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const EmailIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const EditIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const Profile = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dateOfBirth: user?.dateOfBirth || '',
        emergencyContact: user?.emergencyContact || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetchWithAuth('/users/profile', {
                method: 'PUT',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setEditing(false);
                // Update user context if needed
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {language === "sw" ? "Wasifu Wangu" : "My Profile"}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {language === "sw" 
                            ? "Dhibiti maelezo yako ya binafsi" 
                            : "Manage your personal information"}
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
                        <div className="flex items-center space-x-4">
                            <div className="p-4 bg-white rounded-full">
                                <UserIcon />
                            </div>
                            <div className="text-white">
                                <h2 className="text-2xl font-bold">{user?.fullName || 'User'}</h2>
                                <p className="text-blue-100">{user?.email || ''}</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-6">
                        {!editing ? (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <UserIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {language === "sw" ? "Jina Kamili" : "Full Name"}
                                        </p>
                                        <p className="font-medium text-gray-900">{user?.fullName || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <EmailIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {language === "sw" ? "Barua Pepe" : "Email"}
                                        </p>
                                        <p className="font-medium text-gray-900">{user?.email || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <PhoneIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {language === "sw" ? "Simu" : "Phone"}
                                        </p>
                                        <p className="font-medium text-gray-900">{user?.phone || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <CalendarIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {language === "sw" ? "Tarehe ya Kuzaliwa" : "Date of Birth"}
                                        </p>
                                        <p className="font-medium text-gray-900">{user?.dateOfBirth || '-'}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setEditing(true)}
                                    className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                >
                                    <EditIcon />
                                    <span className="ml-2">
                                        {language === "sw" ? "Hariri Wasifu" : "Edit Profile"}
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {language === "sw" ? "Jina Kamili" : "Full Name"}
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {language === "sw" ? "Barua Pepe" : "Email"}
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {language === "sw" ? "Simu" : "Phone"}
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {language === "sw" ? "Tarehe ya Kuzaliwa" : "Date of Birth"}
                                    </label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading 
                                            ? (language === "sw" ? "Inahifadhi..." : "Saving...")
                                            : (language === "sw" ? "Hifadhi" : "Save")
                                        }
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditing(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        {language === "sw" ? "Ghairi" : "Cancel"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Account Settings */}
                <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {language === "sw" ? "Mipangilio ya Akaunti" : "Account Settings"}
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">
                                    {language === "sw" ? "Arifa za SMS" : "SMS Notifications"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {language === "sw" ? "Pata arifa za dawa kwa SMS" : "Receive medication reminders via SMS"}
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">
                                    {language === "sw" ? "Lugha" : "Language"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {language === "sw" ? "Chagua lugha yako" : "Choose your preferred language"}
                                </p>
                            </div>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="en">English</option>
                                <option value="sw">Kiswahili</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
