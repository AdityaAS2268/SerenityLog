import { useState } from "react";

function JournalForm({ setResult }) {
  const [text, setText] = useState("");

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert("Please write something first");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/journal/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        },
      );

      const data = await response.json();

      setResult(data); // send result to parent component
    } catch (error) {
      console.error("Error analyzing journal:", error);
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

      <button onClick={handleAnalyze}>Analyze Emotion</button>
    </div>
  );
}

export default JournalForm;
