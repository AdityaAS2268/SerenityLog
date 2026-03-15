# Architecture Documentation – SerenityLog

## 1. System Overview

SerenityLog is an AI-assisted journaling system designed to help users understand their emotional patterns through journal analysis. The system uses a Large Language Model (Google Gemini) to detect emotions and generate supportive insights from user-written journal entries.

The application follows a full-stack architecture consisting of a React frontend, a Node.js backend API, Redis caching, and a SQLite database.

---

## 2. High-Level Architecture

```
User
 │
 ▼
React Frontend
 │
 ▼
Express Backend API
 │
 ├── Redis Cache
 │
 ├── Gemini AI
 │
 └── SQLite Database
```

The frontend communicates with the backend API, which handles emotion analysis, insight generation, and data storage.

---

## 3. Frontend Layer

The frontend is built using **React with Vite**.

Responsibilities:

- Collect journal entries from users
- Send API requests to the backend
- Display emotion analysis results
- Visualize emotional trends using charts

Key components:

```
JournalForm.jsx
AnalysisResult.jsx
Insights.jsx
EmotionTrendChart.jsx
```

Libraries used:

- React
- Chart.js

---

## 4. Backend Layer

The backend is implemented using **Node.js and Express**.

Responsibilities:

- Provide REST API endpoints
- Communicate with Gemini AI
- Store journal entries
- Retrieve emotion trends
- Manage caching

Main modules:

```
controllers/
services/
routes/
middleware/
database/
cache/
```

---

## 5. API Endpoints

### Analyze Journal Entry

POST `/api/journal/analyze`

Analyzes journal text using Gemini AI and returns emotion analysis with insights.

Example Request:

```
{
  "text": "I feel happy today"
}
```

Example Response:

```
{
  "emotion": "joy",
  "confidence": 0.95,
  "insight": "...",
  "suggestion": "..."
}
```

---

### Emotion Trends

GET `/api/journal/trends`

Returns aggregated emotion statistics from stored journal entries.

Example Response:

```
{
  "mostFrequentEmotion": "joy",
  "emotionCounts": {
    "joy": 5,
    "stress": 2
  }
}
```

---

### AI Insights

GET `/api/journal/insights`

Generates emotional insights based on the most recent journal entry.

---

## 6. AI Integration

SerenityLog integrates with **Google Gemini API** to perform:

- Emotion detection
- Insight generation
- Wellness suggestions

The backend sends structured prompts to Gemini and parses JSON responses.

Example tasks handled by the AI model:

- Identifying emotional tone
- Providing reflective insights
- Suggesting coping strategies

---

## 7. Database Layer

SQLite is used as the primary data storage system.

Table: `journals`

Fields:

```
id
text
emotion
confidence
created_at
```

The database stores all journal entries along with detected emotions and confidence scores.

---

## 8. Redis Caching Layer

Redis is used to improve system performance by caching expensive operations.

Cached data includes:

- Emotion analysis results
- AI insights
- Emotion trend statistics

Cache keys follow the format:

```
analysis:<journal text>
emotion_trends
insight:<journal text>
```

Benefits:

- Reduces repeated calls to Gemini API
- Improves API response times
- Reduces computational load

---

## 9. Cache Invalidation Strategy

When a new journal entry is added:

1. The journal entry is saved to SQLite.
2. Cached emotion trend data is deleted.
3. The next request recalculates trends and updates Redis.

This ensures that cached data remains accurate.

---

## 10. Middleware

The system includes middleware for:

- Rate limiting
- Cross-Origin Resource Sharing (CORS)

Rate limiting protects the backend from excessive API requests.

---

## 11. Data Flow

1. User writes a journal entry.
2. Frontend sends request to `/api/journal/analyze`.
3. Backend checks Redis cache.
4. If cache miss:
   - Backend calls Gemini API.
   - Result is stored in Redis.

5. Journal entry is stored in SQLite.
6. Backend returns emotion analysis and insights to frontend.

---

## 12. Future Improvements

Potential improvements include:

- User authentication
- Cloud database integration
- Emotion timeline visualization
- Sentiment progression analysis
- Deployment to cloud platforms
