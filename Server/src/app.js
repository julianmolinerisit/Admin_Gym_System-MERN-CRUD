// app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import taksRoutes from './routes/tasks.routes.js';
import accessRoutes from './routes/access.routes.js';
import statisticsRoutes from './routes/statistics.routes.js'; // Importa las rutas de estadísticas

import { FRONTEND_URL } from './config.js';

const app = express();

app.use(
	cors({
		credentials: true,
		origin: FRONTEND_URL,
	})
);
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', taksRoutes);
app.use('/api', accessRoutes); // Usa las rutas de acceso
app.use('/api/statistics', statisticsRoutes); // Usa las rutas de estadísticas

if (process.env.NODE_ENV === 'production') {
	const path = await import('path');
	app.use(express.static('client/dist'));

	app.get('*', (req, res) => {
		console.log(path.resolve('client', 'dist', 'index.html'));
		res.sendFile(path.resolve('client', 'dist', 'index.html'));
	});
}

export default app;
