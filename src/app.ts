import express from 'express';
import testConnectionRouter from './routes/test-connection';
import authRouter from './routes/auth';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', testConnectionRouter);
app.use('/api', authRouter);

export default app;
