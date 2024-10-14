import { Request, Response } from 'express';
import { connectDB } from '../../../../services/database/connect';
import { putUsersZone } from '../../../../services/admin/users';
import { getUsersToDecrypt } from '../../../../services/encrypt';
import { convertVectorToString, decryptValue } from '../../../../lib/crypto';

// Update user zone from rh_personal_actual
export const PUT = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();

    const users = await getUsersToDecrypt({ pool });

    if (!users || users.length === 0)
      return res.status(404).json({ message: 'Users not found' });

    const decryptedUsers = users?.map((user) => {
      const { idUsuario, rut } = user;
      const decryptedRut = decryptValue({
        content: rut,
        iv: convertVectorToString()
      });
      return { idUsuario, rut: decryptedRut };
    });

    await Promise.all(
      decryptedUsers.map(async (user) => {
        await putUsersZone({ pool, values: user });
      })
    );

    return res
      .status(200)
      .json({ message: `Zones assigned. Total: ${decryptedUsers.length}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
