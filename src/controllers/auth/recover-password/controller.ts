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
import {
  convertVectorToBuffer,
  decryptValue,
  encryptValue
} from '../../../lib/crypto';

// Verify if user has requested a password recovery
export const GET = async (req: Request, res: Response) => {
  try {
    const { token, correo } = req.query as { token: string; correo: string };

    if (!token || !correo)
      return res.status(400).json({ message: 'Missing fields' });

    const pool = await connectDB();

    const iv = convertVectorToBuffer();
    const { content: encryptedEmail } = encryptValue({
      value: correo,
      iv
    });

    const resultUser = await getUserByEmail({
      pool,
      values: { correo: encryptedEmail }
    });

    if (resultUser.recordset.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const user = formatObjectToCamelCase(resultUser.recordset[0]);

    const resultRecovery = await getRecoveryInstance({
      pool,
      values: { token: parseInt(token) }
    });

    if (resultRecovery.recordset.length === 0)
      return res.status(404).json({ message: 'Recovery instance not found' });

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

    const iv = convertVectorToBuffer();

    const { content: encryptedRut } = encryptValue({
      value: rut,
      iv
    });

    const result = await insRecoveryInstance({
      pool,
      values: { rut: encryptedRut, token }
    });

    if (!result.recordset)
      return res.status(404).json({ message: 'User does not exist' });

    if (result.recordset.length === 0)
      return res
        .status(500)
        .json({ message: 'Error creating recovery instance' });

    const userEmailRequest = await getUserEmail({
      pool,
      values: { rut: encryptedRut }
    });

    if (userEmailRequest.recordset.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const correo = userEmailRequest.recordset[0].correo;

    if (!correo) return res.status(404).json({ message: 'Email not found' });

    const recoveryInstance = formatObjectToCamelCase(result.recordset[0]);

    const stringIv = iv.toString('hex');
    const decryptedEmail = decryptValue({
      iv: stringIv,
      content: correo
    });
    const decryptedFirstName = decryptValue({
      iv: stringIv,
      content: recoveryInstance.primerNombre
    });
    const decryptedLastName = decryptValue({
      iv: stringIv,
      content: recoveryInstance.apellidoPaterno
    });

    await sendRecoveryLink({
      to: decryptedEmail,
      name: `${decryptedFirstName} ${decryptedLastName}`,
      correo: decryptedEmail,
      token
    });

    return res
      .status(200)
      .json({ nombre: `${decryptedFirstName} ${decryptedLastName}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
