import { Request, Response } from 'express';
import { connectDB } from '../database/connect';
import { comparePasswords, hashPassword } from '../lib/bcrypt';
import { generateVerificationCode } from '../utils/generators';
import { sendEmail } from '../services/email/email';
import { formatObjectToCamelCase } from '../utils/formatters';
import { sendVerificationCodeEmail } from '../services/email/auth';

// Login user with username and password
export const GET = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.query;

    if (!username || !password)
      return res.status(400).send('Username and password are required');

    const pool = await connectDB();
    const result = await pool
      .request()
      .input('username', username)
      .query(
        'SELECT TOP 1 codigo_usuario, contraseña, primer_nombre, apellido_paterno, correo_electronico FROM dbo.adm_usuarios WHERE rut = @username'
      );

    if (result.recordset.length === 0)
      return res.status(401).send('Username or password invalid');

    const user = result.recordset[0];

    const isPasswordValid = await comparePasswords(
      String(password),
      user.contraseña
    );

    if (!isPasswordValid)
      return res.status(401).send('Username or password invalid');

    delete user.contraseña;
    const formattedUser = formatObjectToCamelCase(user);

    const verificationCode = generateVerificationCode();

    await sendVerificationCodeEmail({
      to: formattedUser.correoElectronico,
      name: `${formattedUser.primerNombre} ${formattedUser.apellidoPaterno}`,
      verificationCode
    });

    res.status(200).json(formattedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//! TEMPORARY
//! Create user with username and password
export const POST = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).send('Username and password are required');

    const hashedPassword = await hashPassword(password);

    const pool = await connectDB();
    await pool
      .request()
      .input('username', username)
      .input('contraseña', hashedPassword)
      .input('primer_nombre', 'MAXIMILIANO')
      .input('segundo_nombre', 'ANDREE')
      .input('apellido_paterno', 'ROGERS')
      .input('apellido_materno', 'SEPULVEDA')
      .input('nombre_usuario', 'mrs')
      .input('codigo_perfil', 1)
      .input('correo_electronico', 'mrs@rbu.cl')
      .input('codigo_usuario_registro', 1)
      .query(
        'INSERT INTO dbo.adm_usuarios (rut, contraseña, primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, nombre_usuario, codigo_perfil, correo_electronico, codigo_usuario_registro) VALUES (@username, @contraseña, @primer_nombre, @segundo_nombre, @apellido_paterno, @apellido_materno, @nombre_usuario, @codigo_perfil, @correo_electronico, @codigo_usuario_registro)'
      );

    return res.status(200).json({ message: 'User created' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
