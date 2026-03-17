import { useEffect, useState } from "react";

function Insights() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/journal/timeline`)
      .then((res) => res.json())
      .then((data) => setInsights(data));
  }, []);

  if (!insights) return <p>Loading insights...</p>;

  return (
    <div>
      <h2>AI Insights</h2>
      <p>{insights.insight}</p>
      <p>{insights.suggestion}</p>
    </div>
  );
}

export default Insights;
