import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'; 
import noteRoutes from './routes/notesRoutes';
import { connectDB } from './config/db';
import cors from 'cors'
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173','https://your-frontend-app.onrender.com'] ,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


connectDB();
app.use('/api/auth', userRoutes);
app.use('/api/notes', noteRoutes); 

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(port, () => {
  console.log(` server is running on ${port}`);
});
