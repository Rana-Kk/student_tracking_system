import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';

// Rotalar
import authRoutes from './routes/auth.routes.js';
import coursesRoutes from './routes/courses.routes.js';
import groupsRoutes from './routes/groups.routes.js';
import usersRoutes from './routes/users.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Uçları
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/users', usersRoutes);

// Hata Yakalayıcı (En altta kalmalı)
app.use(errorHandler);

export { app };
export default app;
