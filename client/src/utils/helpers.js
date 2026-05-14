export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  // Format as +254 XXX XXX XXX
  if (cleaned.length === 9) {
    return `+254 ${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6)}`;
  }
  return phone;
};

export const formatDate = (date, locale = 'en') => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'sw-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time, locale = 'en') => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString(locale === 'en' ? 'en-US' : 'sw-KE', {
    hour: 'numeric',
    minute: '2-digit'
  });
};

export const calculateAdherenceRate = (taken, total) => {
  if (total === 0) return 0;
  return Math.round((taken / total) * 100);
};

export const getAdherenceColor = (rate) => {
  if (rate >= 90) return '#48BB78';
  if (rate >= 75) return '#9AE6B4';
  if (rate >= 50) return '#F6AD55';
  return '#FC8181';
};

export const getAdherenceStatus = (rate) => {
  if (rate >= 90) return 'excellent';
  if (rate >= 75) return 'good';
  if (rate >= 50) return 'fair';
  return 'poor';
};

export const groupRemindersByTime = (reminders) => {
  return reminders.reduce((groups, reminder) => {
    const hour = reminder.time.split(':')[0];
    const period = parseInt(hour) < 12 ? 'morning' : parseInt(hour) < 17 ? 'afternoon' : 'evening';
    if (!groups[period]) groups[period] = [];
    groups[period].push(reminder);
    return groups;
  }, {});
};

export const validatePhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 9 || cleaned.length === 12;
};

export const validatePIN = (pin) => {
  return /^\d{6}$/.test(pin);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const getAIEngineName = (engine, language = 'en') => {
  if (engine === 'fadhili') return language === 'en' ? 'Fadhili AI' : 'Fadhili AI';
  if (engine === 'gemini') return 'Gemini API';
  return language === 'en' ? 'Basic System' : 'Mfumo wa Kawaida';
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay * Math.pow(2, i));
    }
  }
};
