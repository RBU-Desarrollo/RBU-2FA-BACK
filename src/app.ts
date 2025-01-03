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
import activeTokenRouter from './routes/active-token';
import adminRouter from './routes/admin';
import encryptRouter from './routes/encrypt';
import temporaryRouter from './routes/temporary';

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://rbusantiago.rbu.cl',
      'https://mantenimiento.rbu.cl',
      'https://gsoft.rbu.cl',
      'http://localhost:4000',
      'https://apicorreo.rbu.cl',
      'http://192.168.70.12:3051'
    ]
  })
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
app.use('/api', activeTokenRouter);
app.use('/api', adminRouter);
app.use('/api', encryptRouter);

app.use('/api', temporaryRouter);

export default app;
