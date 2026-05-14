import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = (message, type = "info") => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const value = {
        showNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        className={`
                            p-4 rounded-lg shadow-lg text-white max-w-sm
                            ${notif.type === "error" ? "bg-red-500" :
                              notif.type === "success" ? "bg-green-500" :
                              "bg-blue-500"}
                        `}
                    >
                        {notif.message}
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
