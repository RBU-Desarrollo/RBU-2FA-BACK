import { Request, Response } from 'express';
import sql from 'mssql';
import { connectDB } from '../../services/database/connect';
import { comparePasswords, hashPassword } from '../../lib/bcrypt';
import { generateVerificationCode } from '../../utils/generators';
import { formatObjectToCamelCase } from '../../utils/formatters';
import { sendVerificationCodeEmail } from '../../services/email/auth';
import { getUserLogin } from '../../services/auth';
import { insOTPCode } from '../../services/otp';

// Login user with username and password
export const GET = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.query as {
      username: string;
      password: string;
    };

    if (!username || !password)
      return res.status(400).send('Username and password are required');

    const pool = await connectDB();
    const userResult = await getUserLogin({
      pool,
      values: { username }
    });

    if (userResult.recordset.length === 0)
      return res.status(401).send('Username or password invalid');

    const user = userResult.recordset[0];
    const formattedUser = formatObjectToCamelCase(user);

    const isPasswordValid = await comparePasswords(
      String(password),
      formattedUser.hashedPassword
    );

    if (!isPasswordValid)
      return res.status(401).send('Username or password invalid');

    delete formattedUser.hashedPassword;
    const verificationCode = generateVerificationCode();

    const otpResult = await insOTPCode({
      pool,
      values: { idUsuario: formattedUser.idUsuario, otp: verificationCode }
    });

    if (otpResult.rowsAffected[0] === 0)
      return res.status(500).send('Error creating OTP');

    await sendVerificationCodeEmail({
      to: formattedUser.correoElectronico,
      name: `${formattedUser.primerNombre} ${formattedUser.apellidoPaterno}`,
      verificationCode
    });

    res.status(200).json({ idUsuario: formattedUser.idUsuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//! TEMPORARY
//! Create user with username and password
//! The system should not be able to create a user
//! However, for testing purposes, this endpoint is available
export const POST = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).send('Username and password are required');

    const hashedPassword = await hashPassword(password);

    const pool = await connectDB();
    await pool
      .request()
      .input('username', sql.VarChar(10), username)
      .input('password', sql.VarChar(72), hashedPassword)
      .input('primerNombre', sql.VarChar(50), 'Maximiliano')
      .input('segundoNombre', sql.VarChar(50), 'Andrée')
      .input('apellidoPaterno', sql.VarChar(50), 'Rogers')
      .input('apellidoMaterno', sql.VarChar(50), 'Sepúlveda')
      .input('correoElectronico', sql.VarChar(50), 'mrs@rbu.cl')
      .execute('fa_procInsUser');

    return res.status(200).json({ message: 'User created' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
