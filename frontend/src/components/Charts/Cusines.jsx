import React, { useMemo } from 'react';
import { Radar } from 'react-chartjs-2';

// Distribución de ingredientes (Top N)
const Cuisines = ({ recipes }) => {
  const { labels, values } = useMemo(() => {
    const counter = new Map();
    (recipes || []).forEach((r) => {
      const arr = Array.isArray(r.ingredients) ? r.ingredients : [];
      for (const item of arr) {
        const name = String(item).trim();
        if (!name) continue;
        counter.set(name, (counter.get(name) || 0) + 1);
      }
    });
    const sorted = Array.from(counter.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const lbls = sorted.map((e) => e[0]);
    const vals = sorted.map((e) => e[1]);
    return { labels: lbls.length ? lbls : ['Sin ingredientes'], values: vals.length ? vals : [0] };
  }, [recipes]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Ingredientes más usados',
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const suggestedMax = Math.max(...values) + 1;
  const options = {
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 0,
        suggestedMax,
      },
    },
  };

  return (
    <div style={{ width : '40%', margin : 'auto' }}>
      <h2 style={{ fontWeight: 'bold', fontSize : '25px', margin : '30px 0' }}>Distribución de ingredientes</h2>
      <Radar data={data} options={options} />
    </div>
  );
};

export default Cuisines;
