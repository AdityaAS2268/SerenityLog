import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function EmotionTrendChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/journal/trends`)
      .then((res) => res.json())
      .then((data) => {
        // 🚨 HANDLE ERROR RESPONSE
        if (!data || !data.emotionCounts) {
          console.error("Invalid trends data:", data);
          return;
        }

        const emotions = Object.keys(data.emotionCounts);
        const counts = Object.values(data.emotionCounts);

        setChartData({
          labels: emotions,
          datasets: [
            {
              label: "Emotion Frequency",
              data: counts,
              backgroundColor: [
                "#4CAF50",
                "#2196F3",
                "#FFC107",
                "#F44336",
                "#9C27B0",
              ],
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  if (!chartData) return <p>Loading emotion trends...</p>;

  return (
    <div style={{ width: "500px", margin: "auto" }}>
      <h2>Emotion Trends</h2>
      <Bar data={chartData} />
    </div>
  );
}

export default EmotionTrendChart;
