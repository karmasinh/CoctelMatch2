import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';

// Distribución por etiquetas (categorías/perfiles de sabor)
const VegNonVegChart = ({ recipeData }) => {
  const { labels, values } = useMemo(() => {
    const tagCounts = new Map();
    (recipeData || []).forEach((r) => {
      const tags = Array.isArray(r.tags) ? r.tags : [];
      for (const t of tags) {
        const key = String(t).trim();
        if (!key) continue;
        tagCounts.set(key, (tagCounts.get(key) || 0) + 1);
      }
    });

    // Tomar las 8 etiquetas más frecuentes
    const sorted = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const lbls = sorted.map((e) => e[0]);
    const vals = sorted.map((e) => e[1]);
    return { labels: lbls.length ? lbls : ['Sin etiquetas'], values: vals.length ? vals : [0] };
  }, [recipeData]);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(99, 255, 132, 0.2)',
          'rgba(132, 99, 255, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(99, 255, 132, 1)',
          'rgba(132, 99, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width : '40%', margin : 'auto' }}>
      <h2 style={{ fontWeight: 'bold', fontSize : '25px', margin : '30px 0' }}>Etiquetas más usadas (categorías/perfiles)</h2>
      <Doughnut data={chartData} />
    </div>
  );
};

export default VegNonVegChart;
