import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./ProtectedRoute.jsx";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import RegistroAccesoPage from "./pages/RegistroAccesoPage";
import StatisticsPage from './pages/StatisticsPage';
import PriceManagement from './pages/PriceManagement';

import { TaskFormPage } from "./pages/TaskFormPage";
import { LoginPage } from "./pages/LoginPage";
import { TasksPage } from "./pages/TasksPage";
import { TaskProvider } from "./context/tasksContext";
import CheckoutManagement from "./pages/CheckoutManagement.jsx";

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <main className="container content-container mx-auto px-10 md:px-0">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/registro-acceso" element={<RegistroAccesoPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/add-task" element={<TaskFormPage />} />
                <Route path="/tasks/:id" element={<TaskFormPage />} />
                <Route path="/profile" element={<h1>Perfil</h1>} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/prices" element={<PriceManagement />} />
                <Route path="/checkout" element={<CheckoutManagement />} />

              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;

