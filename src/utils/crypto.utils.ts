import * as bcrypt from 'bcrypt';

export default class CryptoUtils {

    static async generateSalt(rounds: number) {
        return await bcrypt.genSalt(rounds);
    }

    static async encrypt(data: string): Promise<string> {
        const salt = await this.generateSalt(10);
        return await bcrypt.hash(data, salt);
    }

    static async compare(data: string, dataHash: string) {
        return await bcrypt.compare(data, dataHash);
    }
}