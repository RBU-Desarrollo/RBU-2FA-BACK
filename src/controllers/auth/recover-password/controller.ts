import { Request, Response } from 'express';
import { getUserByEmail } from '../../../services/auth';
import { connectDB } from '../../../services/database/connect';
import {
  getRecoveryInstance,
  insRecoveryInstance,
  putUpdatePassword
} from '../../../services/recover-password';
import { generateRecoveryToken } from '../../../utils/generators';
import { formatObjectToCamelCase } from '../../../utils/formatters';
import { sendRecoveryLink } from '../../../services/email/recover-password';

// Verify if user has requested a password recovery
export const GET = async (req: Request, res: Response) => {
  try {
    const { token, correo } = req.query as { token: string; correo: string };

    if (!token || !correo)
      return res.status(400).json({ message: 'Missing fields' });

    const pool = await connectDB();

    const resultUser = await getUserByEmail({ pool, values: { correo } });

    if (resultUser.recordset.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const user = formatObjectToCamelCase(resultUser.recordset[0]);

    const resultRecovery = await getRecoveryInstance({
      pool,
      values: { token: parseInt(token) }
    });

    if (resultRecovery.recordset.length === 0)
      return res.status(404).json({ message: 'Recovery instance not found' });

    const recoveryInstance = formatObjectToCamelCase(
      resultRecovery.recordset[0]
    );

    return res.status(200).json({ idUsuario: user.idUsuario });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a recovery instance for the user
export const POST = async (req: Request, res: Response) => {
  try {
    const { correo } = req.body as { correo: string };

    if (!correo)
      return res.status(400).json({ message: 'User ID is required' });

    const pool = await connectDB();

    const token = generateRecoveryToken();

    const result = await insRecoveryInstance({
      pool,
      values: { correo, token }
    });

    if (!result.recordset)
      return res.status(500).json({ message: 'User email does not exist' });

    if (result.recordset.length === 0)
      return res
        .status(500)
        .json({ message: 'Error creating recovery instance' });

    const recoveryInstance = formatObjectToCamelCase(result.recordset[0]);

    await sendRecoveryLink({
      to: correo,
      name: recoveryInstance.nombre,
      correo,
      token
    });

    return res.status(200).json(recoveryInstance);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update the user's password and delete the recovery instance
export const PUT = async (req: Request, res: Response) => {
  try {
    const { idUsuario, password } = req.body as {
      idUsuario: number;
      password: string;
    };

    if (!idUsuario || !password)
      return res.status(400).json({ message: 'Missing fields' });

    const pool = await connectDB();

    const result = await putUpdatePassword({
      pool,
      values: { idUsuario, password }
    });

    if (result.rowsAffected[0] === 0)
      return res.status(500).json({ message: 'Error updating password' });

    return res.status(200).json({ idUsuario });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
