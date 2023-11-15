type CredType = {
  api_key: string;
  client_code: string;
  client_pin: string;
  client_totp_pin: string;
};
type CredentailsType = {
  handleChange: (isVerified: boolean, creds: CredType) => void;
};
