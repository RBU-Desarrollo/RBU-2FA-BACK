import { Request, Response } from 'express';
import { connectDB } from '../../../services/database/connect';
import { putUser } from '../../../services/admin/users';

export const PUT = async (req: Request, res: Response) => {
  try {
    const {
      idUsuario,
      usuario,
      correoElectronico,
      telefono,
      direccion,
      idZona,
      idPerfil
    } = req.body as {
      idUsuario: number;
      usuario: string;
      correoElectronico: string;
      telefono?: string | null;
      direccion?: string | null;
      idZona?: number | null;
      idPerfil: number;
    };

    if (!idUsuario || !usuario || !correoElectronico || !idPerfil) {
      return res
        .status(400)
        .json({ message: 'Missing required fields', updated: false });
    }

    const pool = await connectDB();
    const request = await putUser({
      pool,
      values: {
        idUsuario,
        usuario,
        correoElectronico,
        telefono,
        direccion,
        idZona,
        idPerfil
      }
    });

    if (request.returnValue !== 1) {
      return res.status(400).json({
        message: 'Could not update user',
        updated: false
      });
    }

    return res.status(200).json({ message: 'User updated', updated: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', updated: false });
  }
};
