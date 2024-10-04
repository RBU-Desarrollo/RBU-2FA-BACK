import { Request, Response } from 'express';
import { getUserByEmail, getUserEmail } from '../../../services/auth';
import { connectDB } from '../../../services/database/connect';
import {
  getRecoveryInstance,
  insRecoveryInstance
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
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a recovery instance for the user
export const POST = async (req: Request, res: Response) => {
  try {
    const { rut } = req.body as { rut: string };

    if (!rut) return res.status(400).json({ message: 'Missing fields' });

    const pool = await connectDB();

    const token = generateRecoveryToken();

    const result = await insRecoveryInstance({
      pool,
      values: { rut, token }
    });

    if (!result.recordset)
      return res.status(500).json({ message: 'User does not exist' });

    if (result.recordset.length === 0)
      return res
        .status(500)
        .json({ message: 'Error creating recovery instance' });

    const userEmailRequest = await getUserEmail({ pool, values: { rut } });

    if (userEmailRequest.recordset.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const correo = userEmailRequest.recordset[0].correo;

    if (!correo) return res.status(404).json({ message: 'Email not found' });

    const recoveryInstance = formatObjectToCamelCase(result.recordset[0]);

    await sendRecoveryLink({
      to: correo,
      name: recoveryInstance.nombre,
      correo,
      token
    });

    return res.status(200).json(recoveryInstance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
