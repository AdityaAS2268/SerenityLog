import { useEffect, useState } from "react";

function Insights() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/journal/insights")
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
