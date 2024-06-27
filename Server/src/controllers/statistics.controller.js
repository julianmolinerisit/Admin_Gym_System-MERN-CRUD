import Task from '../models/task.model.js';
import Price from '../models/price.model.js'; // Suponiendo que tienes un modelo Price para la evolución del precio


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

    const busiestDays = await Task.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$ultimoAcceso" },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const busiestHours = await Task.aggregate([
      {
        $group: {
          _id: { $hour: "$ultimoAcceso" },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalUsers,
      activeMemberships,
      expiredMemberships,
      monthlyRegistrations,
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
    const monthlyRegistrations = await Task.aggregate([
      { $match: { _id: taskId } },
      {
        $group: {
          _id: { $month: "$fechaInicioMembresia" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ monthlyRegistrations });
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