import { EmailValues } from '../../types/email';
import { sendEmail } from './email';

type SendVerificationCodeEmailValues = Pick<EmailValues, 'to'> & {
  name: string;
  verificationCode: number;
};

export const sendVerificationCodeEmail = async ({
  to,
  name,
  verificationCode
}: SendVerificationCodeEmailValues): Promise<boolean> => {
  try {
    const isEmailSent = await sendEmail({
      from: 'mrs@rbu.cl',
      to,
      subject: 'Código de verificación',
      attachments: [],
      properties: {
        nombre: name,
        codigoVerificacion: verificationCode
      },
      endpoint: '/verificationCode'
    });

    return isEmailSent;
  } catch (error) {
    console.log(error);
    return false;
  }
};
