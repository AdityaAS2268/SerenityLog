import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function EmotionTimeline() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/journal/timeline")
      .then((res) => res.json())
      .then((rows) => {
        const grouped = {};

        rows.forEach((r) => {
          const date = new Date(r.created_at).toLocaleDateString();

          if (!grouped[date]) {
            grouped[date] = 0;
          }

          grouped[date] += 1;
        });

        const labels = Object.keys(grouped);
        const values = Object.values(grouped);

        setData({
          labels,
          datasets: [
            {
              label: "Emotion Timeline",
              data: values,
              borderColor: "#4CAF50",
              tension: 0.4,
            },
          ],
        });
      });
  }, []);

  if (!data) return <p>Loading timeline...</p>;

  return <Line data={data} />;
}

export default EmotionTimeline;
