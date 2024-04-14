import { importEncryptSecret } from "uncsrf";
let secretKey;
export const useSecretKey = async (options) => secretKey ? secretKey : secretKey = await importEncryptSecret(options.encryptSecret, options.encryptAlgorithm);
