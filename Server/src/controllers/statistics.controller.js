// controllers/statistics.controller.js
import Task from '../models/task.model.js'; // Asumiendo que tus datos están en el modelo Task

export const getStatistics = async (req, res) => {
  try {
    const totalUsers = await Task.countDocuments();
    const activeMemberships = await Task.countDocuments({ pagado: true });
    const expiredMemberships = await Task.countDocuments({ pagado: false });

    const monthlyRegistrations = await Task.aggregate([
      {
        $group: {
          _id: { $month: "$fechaInicioMembresia" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalUsers,
      activeMemberships,
      expiredMemberships,
      monthlyRegistrations
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};
