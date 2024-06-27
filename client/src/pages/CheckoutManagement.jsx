import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CheckoutManagement = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("month");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("/pagos");
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  // Calculando estadísticas de pagos
  const totalRecaudado = payments.reduce((sum, payment) => sum + payment.monto, 0);
  const promedioPago = payments.length > 0 ? (totalRecaudado / payments.length).toFixed(2) : 0;
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
    <>
     <div className="container mx-auto p-4 bg-gray-800 text-white rounded-lg">

      <h2 className="text-xl font-bold mt-4">Registro de Pagos</h2>
      <div className="flex space-x-4 mt-4">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="bg-gray-700 text-white p-2 rounded"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          className="bg-gray-700 text-white p-2 rounded ml-4"
        />
      </div>
      <div className="flex space-x-4 mt-4">
        <button onClick={() => handleFilterChange("day")} className={`px-4 py-2 rounded ${filter === "day" ? "bg-blue-600" : "bg-gray-700"}`}>Día</button>
        <button onClick={() => handleFilterChange("week")} className={`px-4 py-2 rounded ${filter === "week" ? "bg-blue-600" : "bg-gray-700"}`}>Semana</button>
        <button onClick={() => handleFilterChange("month")} className={`px-4 py-2 rounded ${filter === "month" ? "bg-blue-600" : "bg-gray-700"}`}>Mes</button>
      </div>

      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Monto Pagado</th>
            <th className="px-4 py-2">Usuario</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((payment) => (
            <tr key={payment._id}>
              <td className="border px-4 py-2">{new Date(payment.fecha).toLocaleDateString()}</td>
              <td className="border px-4 py-2">${payment.monto.toFixed(2)}</td>
              <td className="border px-4 py-2">{payment.usuario}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mt-4">Estadísticas de Pagos</h2>
      <p>Total Recaudado: ${totalRecaudado.toFixed(2)}</p>
      <p>Promedio de Pago: ${promedioPago}</p>
      <p>Pago Máximo: ${pagoMaximo.toFixed(2)}</p>
      <p>Pago Mínimo: ${pagoMinimo.toFixed(2)}</p>

      <button
        onClick={handleCierreDeCaja}
        className="bg-red-600 text-white px-4 py-2 rounded mt-4"
      >
        Realizar Cierre de Caja
      </button>
    </div>
    </>

  );
};

export default CheckoutManagement;
