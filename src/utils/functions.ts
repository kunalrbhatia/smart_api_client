import { CredType } from '../components/Credentails/Credentails';

export const isCredFilled = (cred: CredType): boolean => {
  for (const key in cred) {
    if (cred[key as keyof CredType] === '') {
      return false;
    }
  }
  return true;
};
