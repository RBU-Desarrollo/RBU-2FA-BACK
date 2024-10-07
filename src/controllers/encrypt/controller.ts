import { Request, Response } from 'express';
import { connectDB } from '../../services/database/connect';
import {
  convertVectorToBuffer,
  convertVectorToString,
  decryptValue,
  encryptValue,
  generateInitialVector
} from '../../lib/crypto';
import {
  getUsersToDecrypt,
  getUsersToEncrypt,
  putEncryptUser
} from '../../services/encrypt';

// Usuarios para desencriptar
/*
export const GET = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();
    const users = await getUsersToDecrypt({ pool });

    if (!users) return res.status(404).json({ message: 'Users not found' });

    //const iv = convertVectorToString();

    const formattedUsers = users.map((user) => {
      const iv = user.iv;
      const usuario = decryptValue({ content: user.usuario, iv });
      const primerNombre = decryptValue({ content: user.primerNombre, iv });
      const apellidoPaterno = decryptValue({
        content: user.apellidoPaterno,
        iv
      });
      let segundoNombre = null;
      let apellidoMaterno = null;
      let correoElectronico = null;
      let correoPersonal = null;

      if (user.correoElectronico) {
        correoElectronico = decryptValue({
          content: user.correoElectronico,
          iv
        });
      }

      if (user.correoPersonal) {
        correoPersonal = decryptValue({ content: user.correoPersonal, iv });
      }

      if (user.segundoNombre) {
        segundoNombre = decryptValue({ content: user.segundoNombre, iv });
      }

      if (user.apellidoMaterno) {
        apellidoMaterno = decryptValue({ content: user.apellidoMaterno, iv });
      }

      user.usuario = usuario;
      user.rut = usuario;
      user.primerNombre = primerNombre;
      user.apellidoPaterno = apellidoPaterno;
      user.segundoNombre = segundoNombre;
      user.apellidoMaterno = apellidoMaterno;
      user.correoElectronico = correoElectronico;
      user.correoPersonal = correoPersonal;

      return user;
    });

    await Promise.all(
      users.map(async (user) => {
        const iv = convertVectorToBuffer();
        const encryptedUsername = encryptValue({ value: user.usuario, iv });
        const encryptedFirstName = encryptValue({
          value: user.primerNombre,
          iv
        });
        const encryptedLastName = encryptValue({
          value: user.apellidoPaterno,
          iv
        });
        let encryptedSecondName = null;
        let encryptedMotherName = null;
        let encryptedEmail = null;
        let encryptedPersonalEmail = null;

        if (user.segundoNombre) {
          encryptedSecondName = encryptValue({ value: user.segundoNombre, iv });
        }
        if (user.apellidoMaterno) {
          encryptedMotherName = encryptValue({
            value: user.apellidoMaterno,
            iv
          });
        }
        if (user.correoElectronico) {
          encryptedEmail = encryptValue({ value: user.correoElectronico, iv });
        }
        if (user.correoPersonal) {
          encryptedPersonalEmail = encryptValue({
            value: user.correoPersonal,
            iv
          });
        }

        const request = await putEncryptUser({
          pool,
          values: {
            idUsuario: user.idUsuario,
            iv: encryptedUsername.iv,
            usuario: encryptedUsername.content,
            correoElectronico: encryptedEmail?.content ?? null,
            correoPersonal: encryptedPersonalEmail?.content ?? null,
            primerNombre: encryptedFirstName.content,
            segundoNombre: encryptedSecondName?.content ?? null,
            apellidoPaterno: encryptedLastName.content,
            apellidoMaterno: encryptedMotherName?.content ?? null
          }
        });

        if (!request || request.returnValue !== 1)
          return res.status(400).json({ message: 'Error encrypting user' });
      })
    );

    return res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
*/

// Encriptación masiva
export const PUT = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();
    const users = await getUsersToEncrypt({ pool });

    if (!users) return res.status(404).json({ message: 'Users not found' });

    await Promise.all(
      users.map(async (user) => {
        const iv = generateInitialVector();
        const encryptedUsername = encryptValue({ value: user.usuario, iv });
        const encryptedFirstName = encryptValue({
          value: user.primerNombre,
          iv
        });
        const encryptedLastName = encryptValue({
          value: user.apellidoPaterno,
          iv
        });
        let encryptedSecondName = null;
        let encryptedMotherName = null;
        let encryptedEmail = null;
        let encryptedPersonalEmail = null;

        if (user.segundoNombre) {
          encryptedSecondName = encryptValue({ value: user.segundoNombre, iv });
        }
        if (user.apellidoMaterno) {
          encryptedMotherName = encryptValue({
            value: user.apellidoMaterno,
            iv
          });
        }
        if (user.correoElectronico) {
          encryptedEmail = encryptValue({ value: user.correoElectronico, iv });
        }
        if (user.correoPersonal) {
          encryptedPersonalEmail = encryptValue({
            value: user.correoPersonal,
            iv
          });
        }

        const request = await putEncryptUser({
          pool,
          values: {
            idUsuario: user.idUsuario,
            iv: encryptedUsername.iv,
            usuario: encryptedUsername.content,
            correoElectronico: encryptedEmail?.content ?? null,
            correoPersonal: encryptedPersonalEmail?.content ?? null,
            primerNombre: encryptedFirstName.content,
            segundoNombre: encryptedSecondName?.content ?? null,
            apellidoPaterno: encryptedLastName.content,
            apellidoMaterno: encryptedMotherName?.content ?? null
          }
        });

        if (!request || request.returnValue !== 1)
          return res.status(400).json({ message: 'Error encrypting user' });
      })
    );

    return res
      .status(200)
      .json({ message: `Users encrypted. ${users.length} total.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
