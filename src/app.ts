import express from 'express';
import cors from 'cors';
import testConnectionRouter from './routes/test-connection';
import authRouter from './routes/auth';
import otpRouter from './routes/otp';
import tokenRouter from './routes/token';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', testConnectionRouter);
app.use('/api', authRouter);
app.use('/api', otpRouter);
app.use('/api', tokenRouter);

export default app;
