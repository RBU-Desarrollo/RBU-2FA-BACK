import { Request, Response } from 'express';
import { connectDB } from '../../../services/database/connect';
import { insUser, putUser } from '../../../services/admin/users';
import { generateRandomPassword } from '../../../utils/generators';
import { hashPassword } from '../../../lib/bcrypt';

export const POST = async (req: Request, res: Response) => {
  try {
    const body = req.body as {
      rut: string;
      primerNombre: string;
      segundoNombre: string;
      apellidoPaterno: string;
      apellidoMaterno: string;
      correoElectronico: string;
      idZona?: number | null;
      idPerfil: number;
    };
    const { idZona, ...rest } = body;
    const hasUndefinedOrNull = Object.entries(rest).some(
      ([key, value]) => value === undefined || value === null
    );

    if (hasUndefinedOrNull)
      return res
        .status(400)
        .json({ message: 'Missing required fields', created: false });

    const password = generateRandomPassword();
    const hashedPassword = await hashPassword(password);

    const pool = await connectDB();
    const request = await insUser({
      pool,
      values: { ...body, password: hashedPassword }
    });

    if (!request || request.returnValue !== 1)
      return res.status(400).json({
        message: 'Could not create user',
        created: false
      });

    return res.status(201).json({
      message: 'User created',
      created: true
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', created: false });
  }
};

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
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', updated: false });
  }
};
