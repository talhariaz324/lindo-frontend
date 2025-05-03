import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Form Submissions Overview",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Submitted Forms",
      data: labels.map(() => Math.floor(Math.random() * 100)),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    {
      label: "Processed Forms",
      data: labels.map(() => Math.floor(Math.random() * 100)),
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
  ],
};

export function Overview() {
  return (
    <div className="h-[350px] w-full">
      <Bar options={options} data={data} />
    </div>
  );
}
