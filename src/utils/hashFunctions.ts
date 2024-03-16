import bcrypt from "bcrypt";

export const generateHash = (password: string) => bcrypt.hashSync(password, 10);

export const compareHash = (password: string, hash: string) => bcrypt.compareSync(password, hash);
