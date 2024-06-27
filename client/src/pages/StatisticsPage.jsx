import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const StatisticsPage = () => {
  const [statistics, setStatistics] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStatistics, setUserStatistics] = useState(null);
  const [priceEvolution, setPriceEvolution] = useState([]);
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("month");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get("/statistics");
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/tasks");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchPriceEvolution = async () => {
      try {
        const response = await axios.get("/price-evolution");
        setPriceEvolution(response.data);
      } catch (error) {
        console.error("Error fetching price evolution:", error);
      }
    };

    const fetchPayments = async () => {
      try {
        const response = await axios.get("/pagos");
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchStatistics();
    fetchUsers();
    fetchPriceEvolution();
    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchUserStatistics = async (userId) => {
      try {
        const response = await axios.get(`/user-statistics/${userId}`);
        setUserStatistics(response.data);
      } catch (error) {
        console.error("Error fetching user statistics:", error);
      }
    };

    if (selectedUser) {
      fetchUserStatistics(selectedUser._id);
    }
  }, [selectedUser]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Calculando estadísticas de pagos
  const totalRecaudado = payments.reduce((sum, payment) => sum + payment.monto, 0);
  const promedioPago = (payments.length > 0) ? (totalRecaudado / payments.length).toFixed(2) : 0;
  const pagoMaximo = payments.length > 0 ? Math.max(...payments.map(payment => payment.monto)) : 0;
  const pagoMinimo = payments.length > 0 ? Math.min(...payments.map(payment => payment.monto)) : 0;

  // Filtrando pagos
  const filteredPayments = payments.filter((payment) => {
    const paymentDate = new Date(payment.fecha);
    if (filter === "day") {
      return paymentDate.toDateString() === startDate.toDateString();
    } else if (filter === "week") {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return paymentDate >= start && paymentDate <= end;
    } else if (filter === "month") {
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      const end = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      return paymentDate >= start && paymentDate <= end;
    }
    return true;
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === "week") {
      setEndDate(new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000));
    }
  };

  const handleCierreDeCaja = () => {
    // Aquí puedes implementar cualquier lógica adicional que necesites para el cierre de caja.
    alert(`Cierre de caja completado. Total recaudado: ${totalRecaudado}`);
    // Resetear estadísticas de pagos si es necesario
  };

  return (
    <div className="container mx-auto p-4 bg-gray-800 text-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Estadísticas del Gimnasio</h1>
      <div className="flex mb-4">
        <div className="w-1/4 bg-gray-700 p-4 rounded mr-4">
          <h2 className="text-xl font-bold">Lista de Usuarios</h2>
          <ul className="list-disc list-inside">
            <li
              onClick={() => setSelectedUser(null)}
              className="cursor-pointer hover:bg-gray-600 p-2 rounded"
            >
              General
            </li>
            {users.map((user) => (
              <li
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="cursor-pointer hover:bg-gray-600 p-2 rounded"
              >
                {user.nombre} {user.apellido}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-3/4">
          {selectedUser ? (
            <div>
              <h2 className="text-xl font-bold">Estadísticas del Usuario</h2>
              {userStatistics ? (
                <>
                  <p>
                    Visitas este mes:{" "}
                    <span className="font-semibold">{userStatistics.visitsThisMonth}</span>
                  </p>
                  <p>
                    Visitas esta semana:{" "}
                    <span className="font-semibold">{userStatistics.visitsThisWeek}</span>
                  </p>
                  <p>
                    Días más visitados:{" "}
                    <span className="font-semibold">{userStatistics.mostVisitedDays?.join(", ") || "N/A"}</span>
                  </p>
                  <p>
                    Horarios más concurridos:{" "}
                    <span className="font-semibold">{userStatistics.mostVisitedHours?.join(", ") || "N/A"}</span>
                  </p>
                  {/* Gráficos de asistencia por día y hora */}
                  <div className="chart-container grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-700 p-4 rounded">
                      <BarChart width={500} height={300} data={userStatistics.attendanceByDay || []}>
                        <XAxis dataKey="day" stroke="#ffffff" />
                        <YAxis stroke="#ffffff" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                      <BarChart width={500} height={300} data={userStatistics.attendanceByHour || []}>
                        <XAxis dataKey="hour" stroke="#ffffff" />
                        <YAxis stroke="#ffffff" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </div>
                  </div>
                </>
              ) : (
                <p>Cargando estadísticas del usuario...</p>
              )}
            </div>
          ) : (
            <>
              <div>
                <p>
                  Total de usuarios:{" "}
                  <span className="font-semibold">{statistics.totalUsers}</span>
                </p>
                <p>
                  Membresías activas:{" "}
                  <span className="font-semibold">{statistics.activeMemberships}</span>
                </p>
                <p>
                  Membresías expiradas:{" "}
                  <span className="font-semibold">{statistics.expiredMemberships}</span>
                </p>
                <h2 className="text-xl font-bold mt-4">Registros mensuales:</h2>
                <ul className="list-disc list-inside">
                  {statistics.monthlyRegistrations?.map((item) => (
                    <li key={item._id}>
                      Mes {item._id}: {item.count} registros
                    </li>
                  ))}
                </ul>
              </div>

              <div className="chart-container grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-700 p-4 rounded">
                  <LineChart
                    width={500}
                    height={300}
                    data={statistics.monthlyRegistrations}
                  >
                    <XAxis dataKey="_id" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                  </LineChart>
                </div>

                <div className="bg-gray-700 p-4 rounded">
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
                      {statistics.monthlyRegistrations?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </div>

              <h2 className="text-xl font-bold mt-4">Días más concurridos:</h2>
              <div className="chart-container grid grid-cols-1 gap-4 mt-4">
                <div className="bg-gray-700 p-4 rounded">
                  <BarChart width={500} height={300} data={statistics.busiestDays}>
                    <XAxis dataKey="_id" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </div>
              </div>

              <h2 className="text-xl font-bold mt-4">Horarios más concurridos:</h2>
              <div className="chart-container grid grid-cols-1 gap-4 mt-4">
                <div className="bg-gray-700 p-4 rounded">
                  <BarChart width={500} height={300} data={statistics.busiestHours}>
                    <XAxis dataKey="_id" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </div>
              </div>

             
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;



