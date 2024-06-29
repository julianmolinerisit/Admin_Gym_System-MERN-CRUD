// statistics.controller.js
import Task from '../models/task.model.js';
import Price from '../models/price.model.js';

export const getStatistics = async (req, res) => {
  try {
    const totalUsers = await Task.countDocuments();
    const activeMemberships = await Task.countDocuments({ pagado: true });
    const expiredMemberships = await Task.countDocuments({ pagado: false });

    const busiestDays = await Task.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$ultimoIngreso" },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const busiestHours = await Task.aggregate([
      {
        $group: {
          _id: { $hour: "$ultimoIngreso" },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalUsers,
      activeMemberships,
      expiredMemberships,
      busiestDays,
      busiestHours
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

export const getUserStatistics = async (req, res) => {
  try {
    const taskId = req.params.id;

    const userVisits = await Task.findById(taskId).select('visitas');
    
    const visits = userVisits.visitas || [];

    const mostVisitedDays = calculateMostVisitedDays(visits);
    const mostVisitedHours = calculateMostVisitedHours(visits);
    const attendanceByDay = getAttendanceByDay(visits);
    const attendanceByHour = getAttendanceByHour(visits);

    res.json({
      mostVisitedDays,
      mostVisitedHours,
      attendanceByDay,
      attendanceByHour,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas del usuario' });
  }
};

export const getPriceEvolution = async (req, res) => {
  try {
    const priceData = await Price.find();
    res.json(priceData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveUsersEvolution = async (req, res) => {
  try {
    const activeUsers = await Task.aggregate([
      {
        $group: {
          _id: { $month: "$ultimoIngreso" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(activeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la evolución de usuarios activos' });
  }
};

// Helper functions
function calculateMostVisitedDays(visits) {
  const dayCounts = {};
  visits.forEach((visit) => {
    const day = new Date(visit).getDay();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  const sortedDays = Object.entries(dayCounts).sort((a, b) => b[1] - a[1]);
  return sortedDays.map(([day]) => day).slice(0, 3);
}

function calculateMostVisitedHours(visits) {
  const hourCounts = {};
  visits.forEach((visit) => {
    const hour = new Date(visit).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  const sortedHours = Object.entries(hourCounts).sort((a, b) => b[1] - a[1]);
  return sortedHours.map(([hour]) => hour).slice(0, 3);
}

function getAttendanceByDay(visits) {
  const dayCounts = {};
  visits.forEach((visit) => {
    const day = new Date(visit).getDay();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  return Object.entries(dayCounts).map(([day, count]) => ({ day, count }));
}

function getAttendanceByHour(visits) {
  const hourCounts = {};
  visits.forEach((visit) => {
    const hour = new Date(visit).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  return Object.entries(hourCounts).map(([hour, count]) => ({ hour, count }));
}

