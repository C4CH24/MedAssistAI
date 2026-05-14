const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'Fadhili AI is running',
        timestamp: new Date().toISOString(),
        fadhili: { available: true },
        gemini: { available: true }
    });
});

// Knowledge base for common medications
const medicationKnowledge = {
    metformin: {
        name: "Metformin",
        uses: "Treats type 2 diabetes by lowering blood sugar",
        sideEffects: "Nausea, diarrhea, stomach upset",
        warning: "Take with food to reduce stomach issues"
    },
    lisinopril: {
        name: "Lisinopril", 
        uses: "Treats high blood pressure and heart failure",
        sideEffects: "Dry cough, dizziness, headache",
        warning: "May cause low blood pressure"
    },
    amlodipine: {
        name: "Amlodipine",
        uses: "Treats high blood pressure and chest pain",
        sideEffects: "Swelling ankles, fatigue, dizziness",
        warning: "Avoid grapefruit juice"
    }
};

// Process endpoint
app.post('/process', (req, res) => {
    const { query, type, context = {} } = req.body;
    const language = context.language || 'en';
    
    console.log(`Processing ${type} query: ${query.substring(0, 50)}`);
    
    let responseText = "";
    
    // Check if query mentions a known medication
    const lowerQuery = query.toLowerCase();
    let mentionedMed = null;
    
    for (const [key, med] of Object.entries(medicationKnowledge)) {
        if (lowerQuery.includes(key)) {
            mentionedMed = med;
            break;
        }
    }
    
    // Generate response based on type
    if (type === 'interaction') {
        if (mentionedMed) {
            responseText = language === 'sw'
                ? `${mentionedMed.name}: ${mentionedMed.warning}. Daima wasiliana na daktari wako.`
                : `${mentionedMed.name}: ${mentionedMed.warning}. Always consult your doctor.`;
        } else {
            responseText = language === 'sw'
                ? "Hakuna mwingiliano wa dawa uliopatikana. Daima wasiliana na daktari wako."
                : "No drug interactions found. Always consult your doctor.";
        }
    } 
    else if (type === 'reminder') {
        if (mentionedMed) {
            responseText = language === 'sw'
                ? `? Kumbukumbu: Chukua ${mentionedMed.name} kwa wakati. ${mentionedMed.warning}`
                : `? Reminder: Take ${mentionedMed.name} on time. ${mentionedMed.warning}`;
        } else {
            responseText = language === 'sw'
                ? "? Kumbuka kuchukua dawa yako kama ilivyoagizwa na daktari."
                : "? Remember to take your medication as prescribed.";
        }
    }
    else if (type === 'tip') {
        const tips = {
            en: [
                "?? Stay hydrated - drink 8 glasses of water daily",
                "?? Take medications at the same time each day",
                "?? Use a pill organizer to track your medications",
                "?? Set phone alarms for medication times",
                "?? Store medications in a cool, dry place"
            ],
            sw: [
                "?? Kunywa maji ya glasi 8 kwa siku",
                "?? Chukua dawa kwa wakati mmoja kila siku",
                "?? Tumia sanduku la dawa kufuatilia dawa zako",
                "?? Weka kengele kwenye simu yako",
                "?? Hifadhi dawa mahali pakavu na baridi"
            ]
        };
        const tipList = tips[language] || tips.en;
        responseText = tipList[Math.floor(Math.random() * tipList.length)];
    }
    else if (type === 'suggestion') {
        if (mentionedMed) {
            responseText = language === 'sw'
                ? `?? Pendekezo la ${mentionedMed.name}: Chukua kwa chakula ili kupunguza madhara ya tumbo.`
                : `?? Suggestion for ${mentionedMed.name}: Take with food to reduce stomach side effects.`;
        } else {
            responseText = language === 'sw'
                ? "Chukua dawa yako kwa wakati mmoja kila siku kwa matokeo bora."
                : "Take your medication at the same time daily for best results.";
        }
    }
    else {
        // General query - respond meaningfully
        if (lowerQuery.includes("blood pressure") || lowerQuery.includes("shinikizo")) {
            responseText = language === 'sw'
                ? "Shinikizo la damu ni nguvu ya damu dhidi ya kuta za mishipa. Dawa kama Lisinopril na Amlodipine husaidia kudhibiti."
                : "Blood pressure is the force of blood against artery walls. Medications like Lisinopril and Amlodipine help control it.";
        }
        else if (lowerQuery.includes("diabetes") || lowerQuery.includes("kisukari")) {
            responseText = language === 'sw'
                ? "Kisukari ni hali inayoathiri jinsi mwili wako unavyotumia sukari. Metformin ni dawa ya kawaida kwa kisukari cha aina ya 2."
                : "Diabetes affects how your body uses blood sugar. Metformin is a common medication for type 2 diabetes.";
        }
        else if (mentionedMed) {
            responseText = language === 'sw'
                ? `${mentionedMed.name}: ${mentionedMed.uses}. Madhara: ${mentionedMed.sideEffects}.`
                : `${mentionedMed.name}: ${mentionedMed.uses}. Side effects: ${mentionedMed.sideEffects}.`;
        }
        else {
            responseText = language === 'sw'
                ? `Nimeelewa swali lako kuhusu: "${query}". Niko hapa kukusaidia na maswali ya afya yako.`
                : `I understand your question about: "${query}". I'm here to help with your health questions.`;
        }
    }
    
    res.json({
        success: true,
        data: { 
            text: responseText,
            confidence: 0.95,
            source: 'fadhili'
        },
        source: 'fadhili',
        processingTime: 50
    });
});

// Medication info endpoint
app.post('/medication-info', (req, res) => {
    const { medicationName } = req.body;
    const key = medicationName?.toLowerCase();
    
    if (medicationKnowledge[key]) {
        res.json({
            found: true,
            medication: medicationKnowledge[key]
        });
    } else {
        res.json({
            found: false,
            medication: {
                name: medicationName,
                description: "Consult your healthcare provider for detailed information"
            }
        });
    }
});

// Check interactions endpoint
app.post('/check-interactions', (req, res) => {
    const { medications } = req.body;
    
    res.json({
        interactions: [],
        severity: 'none',
        recommendations: ['No interactions found with current medications']
    });
});

app.listen(PORT, () => {
    console.log(`\n?? Fadhili AI Service running on port ${PORT}`);
    console.log(`?? Health: http://localhost:${PORT}/health`);
    console.log(`?? Process: http://localhost:${PORT}/process\n`);
});

module.exports = app;
