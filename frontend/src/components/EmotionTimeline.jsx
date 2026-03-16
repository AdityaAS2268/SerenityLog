import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function EmotionTimeline() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch(`${import.meta.env.VITE_API_URL}/api/journal/timeline`)
        .then((res) => res.json())
        .then((rows) => {
          const labels = rows.map((r) =>
            new Date(r.created_at).toLocaleDateString(),
          );

          const emotions = rows.map((r) => r.emotion);

          setData({
            labels,
            datasets: [
              {
                label: "Emotion Timeline",
                data: emotions.map((_, i) => i + 1),
                borderColor: "#4CAF50",
                tension: 0.4,
              },
            ],
          });
        });
    };

    fetchData();

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <p>Loading timeline...</p>;

  return <Line data={data} />;
}

export default EmotionTimeline;
