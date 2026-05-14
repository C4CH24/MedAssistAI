# Fadhili AI Service

Fadhili AI is a specialized healthcare AI assistant for the MedAssist medication adherence system. It provides personalized health advice, medication information, and supports both English and Swahili languages with a focus on Kenyan healthcare context.

## Features

- **Medication Q&A**: Answers questions about medications, dosages, and side effects
- **Personalized Health Advice**: Provides tailored recommendations based on user context
- **Multilingual Support**: English and Swahili language support
- **Kenyan Healthcare Focus**: Incorporates local healthcare practices and regulations
- **Data Privacy**: Compliant with Kenya Data Protection Act with data minimization
- **Learning Capability**: Improves responses through usage data analysis

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   - `OPENAI_API_KEY`: Your OpenAI API key (uses GPT-3.5-turbo freemium model)
   - `FADHILI_API_KEY`: API key for authentication from main server
   - `MONGODB_URI`: MongoDB connection string

3. Start the service:
   ```bash
   npm start
   ```

   For development:
   ```bash
   npm run dev
   ```

## API Endpoints

### POST /process
Processes AI queries with healthcare context.

**Request:**
```json
{
  "query": "What are the side effects of aspirin?",
  "context": {
    "language": "en",
    "userProfile": {
      "age": 35,
      "conditions": ["hypertension"]
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "AI response here...",
    "source": "fadhili-ai",
    "confidence": 0.85,
    "language": "en"
  },
  "timestamp": "2023-..."
}
```

### GET /health
Health check endpoint.

## Database Models

### AiTrainingData
Stores queries and responses for continuous learning.

### MedicationKnowledgeBase
Contains medication information with Kenyan healthcare focus.

## Security

- API key authentication required
- Data minimization practices
- HTTPS recommended for production
- Regular security audits

## Testing

Run tests:
```bash
npm test
```

## Integration with MedAssist

The service integrates with the main MedAssist server through the existing AI service layer, providing fallback and specialized healthcare AI capabilities.

## License

MIT