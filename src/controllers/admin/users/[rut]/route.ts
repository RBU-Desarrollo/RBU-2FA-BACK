import { Request, Response } from 'express';
import { connectDB } from '../../../../services/database/connect';
import { getUserByRut } from '../../../../services/admin/users';
import { formatObjectToCamelCase } from '../../../../utils/formatters';
import { convertVectorToBuffer, encryptValue } from '../../../../lib/crypto';
import { decryptedUserValues } from '../../../../services/encrypt';

export const GET = async (req: Request, res: Response) => {
  try {
    const { rut } = req.params;

    if (!rut) return res.status(400).json({ message: 'Missing fields' });

    const pool = await connectDB();

    const iv = convertVectorToBuffer();
    const { content: encryptedRut } = encryptValue({ value: rut, iv });

    const request = await getUserByRut({
      pool,
      values: { rut: encryptedRut, normalRut: rut }
    });

    if (!request || request.returnValue !== 1 || request.recordset.length === 0)
      return res
        .status(404)
        .json({ message: 'User not found or is already active' });

    const user = decryptedUserValues(
      formatObjectToCamelCase(request.recordset[0])
    );

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
