import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]); // Corrected state name

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          statsRes,
          usersRes,
          priceRes,
          paymentsRes,
          activeUsersRes,
        ] = await Promise.all([
          axios.get("/statistics"),
          axios.get("/tasks"),
          axios.get("/price-evolution"),
          axios.get("/pagos"),
          axios.get("/active-users-evolution"),
        ]);

        setStatistics(statsRes.data);
        setUsers(usersRes.data);
        setPriceEvolution(priceRes.data.reverse());
        setPayments(paymentsRes.data);
        setActiveUsers(activeUsersRes.data.reverse()); // Corrected state update
      } catch (err) {
        setError("Error fetching data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const totalRecaudado = payments.reduce((sum, payment) => sum + payment.monto, 0);
  const promedioPago = payments.length > 0 ? (totalRecaudado / payments.length).toFixed(2) : 0;
  const pagoMaximo = payments.length > 0 ? Math.max(...payments.map((payment) => payment.monto)) : 0;
  const pagoMinimo = payments.length > 0 ? Math.min(...payments.map((payment) => payment.monto)) : 0;

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

  const formatDay = (dayNumber) => {
    const daysOfWeek = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return daysOfWeek[dayNumber - 1];
  };

  const formatHour = (hour) => {
    const date = new Date();
    date.setHours((hour - 3 + 24) % 24, 0, 0);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderUserStatistics = () => {
    if (!selectedUser) return null;
    if (!userStatistics) return <p>Cargando estadísticas del usuario...</p>;

    return (
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
    );
  };

  return (
    <div className="container mx-auto p-4 bg-gray-800 text-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Estadísticas del Gimnasio</h1>
      <div className="flex mb-4">
        <div className="w-1/4 bg-gray-700 p-4 rounded mr-4">
          <h2 className="text-xl font-bold">Lista de Usuarios</h2>
          <ul className="list-disc list-inside">
            <li onClick={() => setSelectedUser(null)} className="cursor-pointer hover:bg-gray-600 p-2 rounded">
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
              {renderUserStatistics()}
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
                  <span className="font-semibold">
                    {statistics.activeMemberships}
                  </span>
                </p>
                <p>
                  Membresías expiradas:{" "}
                  <span className="font-semibold">
                    {statistics.expiredMemberships}
                  </span>
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

              <h2 className="text-xl font-bold mt-4">Días más concurridos:</h2>
              <div className="chart-container grid grid-cols-1 gap-4 mt-4">
                <div className="bg-gray-700 p-4 rounded">
                  <ul>
                    {statistics.busiestDays?.map((day, index) => (
                      <li key={index}>
                        Día: {formatDay(day._id)}, Visitas: {day.count}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h2 className="text-xl font-bold mt-4">
                Horarios más concurridos:
              </h2>
              <div className="chart-container grid grid-cols-1 gap-4 mt-4">
                <div className="bg-gray-700 p-4 rounded">
                  <ul>
                    {statistics.busiestHours?.map((hour, index) => (
                      <li key={index}>
                        Hora: {formatHour(hour._id)}, Visitas: {hour.count}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="chart-container grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-700 p-4 rounded">
                  <h2 className="text-xl font-bold">Evolución del precio</h2>
                  <LineChart
                    width={500}
                    height={300}
                    data={priceEvolution.map((item) => ({
                      ...item,
                      fecha: new Date(item.fecha).toLocaleDateString(),
                    }))}
                  >
                    <XAxis dataKey="fecha" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="precio"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                  <h2 className="text-xl font-bold">
                    Evolución de usuarios activos
                  </h2>
                  <LineChart
                    width={500}
                    height={300}
                    data={activeUsers.map((item) => ({
                      ...item,
                      fecha: new Date(item.fecha).toLocaleDateString(),
                    }))}
                  >
                    <XAxis dataKey="fecha" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
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
