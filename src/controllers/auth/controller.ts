import { Request, Response } from 'express';
import sql from 'mssql';
import { connectDB } from '../../services/database/connect';
import { comparePasswords, hashPassword } from '../../lib/bcrypt';
import { generateVerificationCode } from '../../utils/generators';
import { formatObjectToCamelCase } from '../../utils/formatters';
import { sendVerificationCodeEmail } from '../../services/email/auth';
import { getUserLogin } from '../../services/auth';
import { insOTPCode } from '../../services/otp';
import { getVerifyPasswordDate } from '../../services/verify-password-date';
import {
  convertVectorToBuffer,
  convertVectorToString,
  decryptValue,
  encryptValue
} from '../../lib/crypto';

// Login user with username and password
export const GET = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.query as {
      username: string;
      password: string;
    };

    if (!username || !password)
      return res
        .status(400)
        .json({ message: 'Username and password are required' });

    const pool = await connectDB();

    const iv = convertVectorToBuffer();

    const { content: encryptedUsername } = encryptValue({
      value: username,
      iv
    });

    const userResult = await getUserLogin({
      pool,
      values: { username: encryptedUsername }
    });

    if (userResult.recordset.length === 0)
      return res.status(401).json({ message: 'Username or password invalid' });

    const user = userResult.recordset[0];
    const formattedUser = formatObjectToCamelCase(user);

    const isPasswordValid = await comparePasswords(
      password,
      formattedUser.hashedPassword
    );

    if (!isPasswordValid) return res.status(401).json({ invalidData: true });

    const { returnValue } = await getVerifyPasswordDate({
      pool,
      values: { username: encryptedUsername }
    });

    if (returnValue === 0) return res.status(401).json({ expiredPass: true });

    delete formattedUser.hashedPassword;
    const verificationCode = generateVerificationCode();

    const otpResult = await insOTPCode({
      pool,
      values: { idUsuario: formattedUser.idUsuario, otp: verificationCode }
    });

    if (otpResult.rowsAffected[0] === 0)
      return res.status(500).json({ message: 'Error creating OTP' });

    const stringIv = convertVectorToString();

    const correoElectronico = formattedUser.correoElectronico
      ? decryptValue({ iv: stringIv, content: formattedUser.correoElectronico })
      : null;
    const primerNombre = decryptValue({
      iv: stringIv,
      content: formattedUser.primerNombre
    });
    const apellidoPaterno = decryptValue({
      iv: stringIv,
      content: formattedUser.apellidoPaterno
    });

    await sendVerificationCodeEmail({
      to: correoElectronico || '',
      name: `${primerNombre} ${apellidoPaterno}`,
      verificationCode
    });

    res.status(200).json({ idUsuario: formattedUser.idUsuario });
  } catch (error) {
    console.error(error);
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
      return res
        .status(400)
        .json({ message: 'Username and password are required' });

    const hashedPassword = await hashPassword(password);

    const pool = await connectDB();
    await pool
      .request()
      .input('username', sql.VarChar(50), username)
      .input('password', sql.VarChar(255), hashedPassword)
      .input('rut', sql.VarChar(10), '11111111-1')
      .input('primerNombre', sql.VarChar(50), 'Usuario')
      .input('segundoNombre', sql.VarChar(50), 'Usuario')
      .input('apellidoPaterno', sql.VarChar(50), 'Prueba')
      .input('apellidoMaterno', sql.VarChar(50), 'Prueba')
      .input('correoElectronico', sql.VarChar(50), 'correo@prueba.cl')
      .execute('fa_procInsUser');

    return res.status(200).json({ message: 'User created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
