import { Request, Response } from 'express';
import { connectDB } from '../../../services/database/connect';
import {
  delPermissions,
  insPermission
} from '../../../services/admin/permissions';

export const POST = async (req: Request, res: Response) => {
  try {
    const { permissions } = req.body as {
      permissions: {
        idPerfil: number;
        idSistema: number;
        idModulo: number;
        idAcceso: number;
      }[];
    };

    if (!permissions || permissions.length === 0)
      return res
        .status(400)
        .json({ message: 'Missing required fields', created: false });

    const pool = await connectDB();

    const uniqueProfiles = [
      ...new Set(permissions.map((permission) => permission.idPerfil))
    ];

    await Promise.all(
      uniqueProfiles.map(async (idPerfil) => {
        await delPermissions({ pool, idPerfil });
      })
    );

    await Promise.all(
      permissions.map(async (permission) => {
        await insPermission({ pool, values: permission });
      })
    );

    return res
      .status(201)
      .json({ message: 'Permission created successfully', created: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error, created: false' });
  }
};
