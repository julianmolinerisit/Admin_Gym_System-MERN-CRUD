import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const Statistics = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('daily');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/api/statistics?filter=${filter}`);
      setData(result.data);
    };
    fetchData();
  }, [filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div className="container">
      <h1>Estadísticas del Gimnasio</h1>
      <select value={filter} onChange={handleFilterChange}>
        <option value="daily">Diario</option>
        <option value="weekly">Semanal</option>
        <option value="monthly">Mensual</option>
      </select>
      <div className="chart-container">
        <LineChart width={600} height={300} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="visits" stroke="#8884d8" />
        </LineChart>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data}
            cx={200}
            cy={200}
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {
              data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color}/>)
            }
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default Statistics;





