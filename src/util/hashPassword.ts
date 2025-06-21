import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
};



export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
    return bcrypt.compare(plain, hashed);
  };