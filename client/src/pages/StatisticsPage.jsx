// src/pages/StatisticsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const StatisticsPage = () => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('/statistics');
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <h1>Estadísticas del Gimnasio</h1>
      <div>
        <p>Total de usuarios: {statistics.totalUsers}</p>
        <p>Membresías activas: {statistics.activeMemberships}</p>
        <p>Membresías expiradas: {statistics.expiredMemberships}</p>
        
        <h2>Registros mensuales:</h2>
        <ul>
          {statistics.monthlyRegistrations?.map((item) => (
            <li key={item._id}>Mes {item._id}: {item.count} registros</li>
          ))}
        </ul>

        <div className="chart-container">
          <LineChart width={600} height={300} data={statistics.monthlyRegistrations}>
            <XAxis dataKey="_id" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
          
          <PieChart width={400} height={400}>
            <Pie
              dataKey="count"
              isAnimationActive={false}
              data={statistics.monthlyRegistrations}
              cx={200}
              cy={200}
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {
                statistics.monthlyRegistrations?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
              }
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
