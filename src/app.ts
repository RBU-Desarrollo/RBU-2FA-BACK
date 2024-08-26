import express from 'express';
import testConnectionRouter from './routes/test-connection';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', testConnectionRouter);

export default app;
