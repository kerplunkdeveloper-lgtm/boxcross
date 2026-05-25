import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";
import PieCharts from "./PieCharts";

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
   
    legend: {
      position: "bottom"
    },
    title: {
      display: true,
      text: "hello how are you sudhagar"
    }
  }
};

const data = {
  labels: ["Jan", "Feb", "Mar"],
  datasets: [
    {
      label: "Present",
      data: [11, 13, 18],
      backgroundColor: "rgba(255, 99, 132, 0.5)"
    },
    {
      label: "Absent",
      data: [4, 2, 3],
      backgroundColor: "rgba(53, 162, 235, 0.5)"
    }
  ]
};

const Chartjs = () => {
  return (
    <div style={{ width: "600px", height: "800px" }} className="container">
      <Bar options={options} data={data} />

      <div style={{marginTop:"70px"}}><PieCharts/></div>
    </div>
  );
};

export default Chartjs;
