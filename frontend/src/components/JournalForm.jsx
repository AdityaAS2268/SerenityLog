import { useState } from "react";

function JournalForm({ setResult }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert("Please write something first");
      return;
    }

    try {
      setLoading(true); // start loading

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/journal/timeline`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        },
      );

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error("Error analyzing journal:", error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div>
      <textarea
        placeholder="Write your journal..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        cols="50"
      />

      <br />

      <button onClick={handleAnalyze} disabled={loading || !text.trim()}>
        {loading ? "Analyzing..." : "Analyze Emotion"}
      </button>

      {loading && <p>⏳ AI is analyzing your emotions...</p>}
    </div>
  );
}

export default JournalForm;
