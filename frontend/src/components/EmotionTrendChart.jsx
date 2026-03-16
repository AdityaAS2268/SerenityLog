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
    const fetchTrend = () => {
      fetch(`${import.meta.env.VITE_API_URL}/api/journal/trends`)
        .then((res) => res.json())
        .then((data) => {
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
                  "#FF9800",
                ],
              },
            ],
          });
        })
        .catch((err) => console.error("Trend fetch error:", err));
    };

    // Initial fetch
    fetchTrend();

    // Auto refresh every 10 seconds
    const interval = setInterval(fetchTrend, 10000);

    return () => clearInterval(interval);
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
