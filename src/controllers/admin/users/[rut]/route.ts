import { Request, Response } from 'express';
import { connectDB } from '../../../../services/database/connect';
import { getUserByRut } from '../../../../services/admin/users';
import { formatObjectToCamelCase } from '../../../../utils/formatters';

export const GET = async (req: Request, res: Response) => {
  try {
    const { rut } = req.params;

    if (!rut) return res.status(400).json({ message: 'Missing fields' });

    const pool = await connectDB();
    const request = await getUserByRut({ pool, values: { rut } });

    if (!request || request.returnValue !== 1 || request.recordset.length === 0)
      return res
        .status(404)
        .json({ message: 'User not found or is already active' });

    return res.status(200).json(formatObjectToCamelCase(request.recordset[0]));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
