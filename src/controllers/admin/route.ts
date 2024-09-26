import { Request, Response } from 'express';
import { connectDB } from '../../services/database/connect';
import { getAdminContent } from '../../services/admin/admin';
import { formatObjectToCamelCase } from '../../utils/formatters';

export const GET = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();
    const request = await getAdminContent({ pool });

    const recordsets = request.recordsets as unknown[][];

    if (recordsets.length === 0)
      return res.status(404).json({ message: 'Not found' });

    const systems = (recordsets[0] ?? []).map((system) =>
      formatObjectToCamelCase(system)
    );
    const profiles = (recordsets[1] ?? []).map((profile) =>
      formatObjectToCamelCase(profile)
    );
    const users = (recordsets[2] ?? []).map((user) =>
      formatObjectToCamelCase(user)
    );
    const modules = (recordsets[3] ?? []).map((module) =>
      formatObjectToCamelCase(module)
    );

    return res.status(200).json({ systems, profiles, users, modules });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
