export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

export const FREQUENCIES = [
  { value: 'daily', label: { en: 'Once daily', sw: 'Mara moja kwa siku' } },
  { value: 'twice_daily', label: { en: 'Twice daily', sw: 'Mara mbili kwa siku' } },
  { value: 'three_times', label: { en: 'Three times daily', sw: 'Mara tatu kwa siku' } },
  { value: 'weekly', label: { en: 'Weekly', sw: 'Kila wiki' } },
  { value: 'as_needed', label: { en: 'As needed', sw: 'Inapohitajika' } }
];

export const REMINDER_TIMES = [
  { value: 'morning', time: '08:00', label: { en: 'Morning', sw: 'Asubuhi' } },
  { value: 'afternoon', time: '14:00', label: { en: 'Afternoon', sw: 'Mchana' } },
  { value: 'evening', time: '20:00', label: { en: 'Evening', sw: 'Jioni' } },
  { value: 'night', time: '22:00', label: { en: 'Night', sw: 'Usiku' } }
];

export const CONDITIONS = [
  { id: 'hypertension', en: 'Hypertension', sw: 'Shinikizo la damu' },
  { id: 'diabetes', en: 'Diabetes', sw: 'Kisukari' },
  { id: 'asthma', en: 'Asthma', sw: 'Pumu' },
  { id: 'hiv', en: 'HIV', sw: 'VVU' },
  { id: 'arthritis', en: 'Arthritis', sw: 'Ugonjwa wa viungo' },
  { id: 'cancer', en: 'Cancer', sw: 'Saratani' },
  { id: 'heart_disease', en: 'Heart Disease', sw: 'Ugonjwa wa moyo' },
  { id: 'kidney_disease', en: 'Kidney Disease', sw: 'Ugonjwa wa figo' },
  { id: 'other', en: 'Other', sw: 'Nyingine' }
];

export const ADHERENCE_COLORS = {
  excellent: '#48BB78',
  good: '#9AE6B4',
  fair: '#F6AD55',
  poor: '#FC8181'
};

export const AI_ENGINES = {
  FADHILI: 'fadhili',
  GEMINI: 'gemini',
  RULE_BASED: 'rule-based'
};

export const NOTIFICATION_CHANNELS = {
  IN_APP: 'in-app',
  SMS: 'sms',
  BOTH: 'both'
};

export const APP_VERSION = '1.0.0';
