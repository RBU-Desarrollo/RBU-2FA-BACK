import { Request, Response } from 'express';
import { connectDB } from '../../../../services/database/connect';
import { getPermissions } from '../../../../services/admin/permissions';
import { formatObjectToCamelCase } from '../../../../utils/formatters';

export const GET = async (req: Request, res: Response) => {
  try {
    const { id: idPerfil } = req.params as { id: string };

    if (!idPerfil)
      return res
        .status(400)
        .json({ message: 'Missing required fields', found: false });

    const pool = await connectDB();

    const permissions = await getPermissions({
      pool,
      idPerfil: parseInt(idPerfil)
    });

    return res
      .status(200)
      .json({
        permissions: permissions.map((p) => formatObjectToCamelCase(p)),
        found: true
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', found: false });
  }
};
