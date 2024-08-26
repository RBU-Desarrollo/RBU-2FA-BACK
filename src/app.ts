import express from 'express';
import cors from 'cors';
import testConnectionRouter from './routes/test-connection';
import authRouter from './routes/auth';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', testConnectionRouter);
app.use('/api', authRouter);

export default app;
