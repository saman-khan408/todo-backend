import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todo-routes.js';
import dotenv from 'dotenv';
import {connectDb} from './configs/db.js';
import { errorHandler } from './middleware/error-middleware.js';

dotenv.config();
await connectDb();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(errorHandler)
app.use('/api',todoRoutes);
app.listen(PORT,() => {
    console.log(`server is running on http://localhost:${PORT}`);
})