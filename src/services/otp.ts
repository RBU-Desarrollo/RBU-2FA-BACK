export const deleteOTPFromDatabase = async (
  codigoUsuario: string
): Promise<boolean> => {
  try {
    // TODO: Delete the OTP from the database

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
