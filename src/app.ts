import express from 'express';
import cors from 'cors';
import testConnectionRouter from './routes/test-connection';
import authRouter from './routes/auth';
import otpRouter from './routes/otp';
import tokenRouter from './routes/token';
import usersRouter from './routes/users';
import systemsRouter from './routes/systems';
import recoverPasswordRouter from './routes/recover-password';
import changePasswordRouter from './routes/change-password';

const app = express();

app.use(
  cors({ origin: ['http://localhost:5173', 'https://rbusantiago.rbu.cl'] })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', testConnectionRouter);
app.use('/api', authRouter);
app.use('/api', otpRouter);
app.use('/api', tokenRouter);
app.use('/api', usersRouter);
app.use('/api', systemsRouter);
app.use('/api', recoverPasswordRouter);
app.use('/api', changePasswordRouter);

export default app;
