import { useState } from "react";

import JournalForm from "./components/JournalForm";
import AnalysisResult from "./components/AnalysisResult";
import Insights from "./components/Insights";
import EmotionTrendChart from "./components/EmotionTrendChart";

import "./App.css";
import EmotionTimeline from "./components/EmotionTimeline";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="container">
      <h1>SerenityLog</h1>

      <div className="card">
        <JournalForm setResult={setResult} />
      </div>

      <div className="card">
        <AnalysisResult result={result} />
      </div>

      <div className="card">
        <Insights />
      </div>

      <div className="card">
        <EmotionTimeline />
      </div>

      <div className="card">
        <EmotionTrendChart />
      </div>
    </div>
  );
}

export default App;
