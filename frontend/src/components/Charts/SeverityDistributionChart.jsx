import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SeverityDistributionChart = () => {
  const [dataObject, setDataObject] = useState({});

  useEffect(() => {
    fetch("http://localhost:8000/api/metrics/severity_distribution")
      .then(res => res.json())
      .then(data => {
        setDataObject(data);
      });
  }, []);

  const chartData = {
    labels: ["Mild", "Moderate", "Severe"],
    datasets: [
      {
        data: [
          dataObject.mild || 0,
          dataObject.moderate || 0,
          dataObject.severe || 0
        ]
      }
    ]
  };

  return (
    <div style={{ width: "400px" }}>
      <h3>Severity Distribution</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default SeverityDistributionChart;
