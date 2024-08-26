import express from 'express';
import testRouter from './routes/auth';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', testRouter);

export default app;
