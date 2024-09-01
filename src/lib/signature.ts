import crypto from 'crypto';
import { env } from './env';

export function verifySignature(body: string, signature: string): boolean {
    const hash = crypto.createHmac('sha1', env.SECRET_TOKEN).update(body).digest('hex');

    return `sha1=${hash}` === signature;
}
