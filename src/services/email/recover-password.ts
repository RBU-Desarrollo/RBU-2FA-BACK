import { EmailValues } from '../../types/email';
import { sendEmail } from './email';

type SendVerificationCodeEmailValues = Pick<EmailValues, 'to'> & {
  name: string;
  correo: string;
  token: number;
};

export const sendRecoveryLink = async ({
  to,
  name,
  correo,
  token
}: SendVerificationCodeEmailValues): Promise<boolean> => {
  try {
    const isEmailSent = await sendEmail({
      from: 'mrs@rbu.cl',
      to,
      subject: 'Recupera tu contraseña',
      attachments: [],
      properties: {
        nombre: name,
        correo,
        token
      },
      endpoint: '/2fa/passwordRecovery'
    });

    return isEmailSent;
  } catch (error) {
    console.log(error);
    return false;
  }
};
