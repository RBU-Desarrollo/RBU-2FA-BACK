import { EmailValues } from '../../types/email';
import { EMAIL_API_ENDPOINT } from '../../config/env';

export const sendEmail = async (config: EmailValues): Promise<boolean> => {
  try {
    await fetch(`${EMAIL_API_ENDPOINT}${config.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
