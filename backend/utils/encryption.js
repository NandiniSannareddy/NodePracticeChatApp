import crypto from 'crypto'

const algorithm="aes-256-cbc"

export function encryption(text){
    const IV=crypto.randomBytes(16);
    const key=Buffer.from(process.env.key, 'hex')
    const cipher=crypto.createCipheriv(algorithm, key, IV);
    let encrypted=cipher.update(text, 'utf-8', 'hex')
    encrypted+=cipher.final('hex');
    const ivtext=IV.toString('hex');
    return {encrypted, ivtext};
}


export function decryption(text, ivtext){
    const IV=Buffer.from(ivtext, 'hex')
    const key=Buffer.from(process.env.key, 'hex')
    const cipher=crypto.createDecipheriv(algorithm, key, IV);
    let decrypted=cipher.update(text, 'hex', 'utf-8')
    decrypted+=cipher.final('utf-8'); 
    return decrypted;  
}
