import { Request, Response } from 'express';
import { connectDB } from '../../../services/database/connect';
import { insUser, putUser } from '../../../services/admin/users';
import { generateRandomPassword } from '../../../utils/generators';
import { hashPassword } from '../../../lib/bcrypt';
import { convertVectorToBuffer, encryptValue } from '../../../lib/crypto';

export const POST = async (req: Request, res: Response) => {
  try {
    const body = req.body as {
      rut: string;
      primerNombre: string;
      segundoNombre?: string | null;
      apellidoPaterno: string;
      apellidoMaterno?: string | null;
      correoElectronico?: string | null;
      correoPersonal?: string | null;
      idZona?: number | null;
      idPerfil: number;
    };
    const { idZona, segundoNombre, apellidoMaterno, ...rest } = body;
    const hasUndefinedOrNull = Object.entries(rest).some(
      ([key, value]) => value === undefined || value === null
    );

    if (hasUndefinedOrNull)
      return res
        .status(400)
        .json({ message: 'Missing required fields', created: false });

    const password = generateRandomPassword();
    const hashedPassword = await hashPassword(password);

    const iv = convertVectorToBuffer();
    const encryptedUsername = encryptValue({ value: body.rut, iv });
    const encrypyedFirstName = encryptValue({ value: body.primerNombre, iv });
    const encryptedLastName = encryptValue({ value: body.apellidoPaterno, iv });
    const encryptedSecondName = segundoNombre
      ? encryptValue({ value: segundoNombre, iv })
      : null;
    const encryptedSecondLastName = apellidoMaterno
      ? encryptValue({ value: apellidoMaterno, iv })
      : null;
    const encryptedEmail = body.correoElectronico
      ? encryptValue({ value: body.correoElectronico, iv })
      : null;
    const encryptedPersonalEmail = body.correoPersonal
      ? encryptValue({ value: body.correoPersonal, iv })
      : null;

    body.rut = encryptedUsername.content;
    body.primerNombre = encrypyedFirstName.content;
    body.apellidoPaterno = encryptedLastName.content;
    body.segundoNombre = encryptedSecondName?.content;
    body.apellidoMaterno = encryptedSecondLastName?.content;
    body.correoElectronico = encryptedEmail?.content;
    body.correoPersonal = encryptedPersonalEmail?.content;

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
      correoElectronico,
      correoPersonal,
      telefono,
      direccion,
      idZona,
      idPerfil
    } = req.body as {
      idUsuario: number;
      correoElectronico?: string | null;
      correoPersonal?: string | null;
      telefono?: string | null;
      direccion?: string | null;
      idZona?: number | null;
      idPerfil: number;
    };

    if (!idUsuario || !idPerfil) {
      return res
        .status(400)
        .json({ message: 'Missing required fields', updated: false });
    }

    const iv = convertVectorToBuffer();
    let encryptedEmail = null;
    let encryptedPersonalEmail = null;

    if (correoElectronico) {
      const { content } = encryptValue({ value: correoElectronico, iv });
      encryptedEmail = content;
    }

    if (correoPersonal) {
      const { content } = encryptValue({ value: correoPersonal, iv });
      encryptedPersonalEmail = content;
    }

    const pool = await connectDB();
    const request = await putUser({
      pool,
      values: {
        idUsuario,
        correoElectronico: encryptedEmail,
        correoPersonal: encryptedPersonalEmail,
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
