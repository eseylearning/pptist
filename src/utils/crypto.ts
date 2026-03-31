import CryptoJS from 'crypto-js'
import JSEncrypt from 'jsencrypt'

const CRYPTO_KEY = 'pptist'

const RSA_PUBLIC_KEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmAPN4W5KvokYMNUyt311
OdPA3lq59El7ETpbNpxSBG5lWpEKw4KjiOIc6N5GRXbPwJWCrWI9RTGdh71Nhykt
5dUjE6kGastnjNhiq92d//5UbbXH1goz8cPYmJ05QgbFDbhT4ilMft9MpUpYIPF+
O4ZfLQyffTn2Lt+SBPihepOb2ZT4jpeoojAF3veWGH7cG8PN9CXe6MtEhs5JsPi1
jtbf4pgs4Slkxj1E9cw2bg9E54ozwraJjnP4X73SILboyotG2uh7K6Ejrzi4lbJr
prSGoMd7DJpyZqJ6sywnQqw/saJ8SJDMn74tItFKckTN1xvktjSxxpNmDqB5jW0C
7QIDAQAB`

const FIXED_KEY = CryptoJS.enc.Utf8.parse('1234567887654321')
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412')

/**
 * 加密
 * @param msg 待加密字符串
 */
export const encrypt = (msg: string) => {
  return CryptoJS.AES.encrypt(msg, CRYPTO_KEY).toString()
}

/**
 * 解密
 * @param ciphertext 待解密字符串
 */
export const decrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export function generateRandomKey(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function rsaEncrypt(str: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(RSA_PUBLIC_KEY)
  return encryptor.encrypt(str)
}

export function Encrypt(str: any, customKey?: string) {
  let type = typeof str
  if (type === 'object') {
    str = JSON.stringify(str)
  } else if (type !== 'string') {
    str += ''
  }
  const aesKey = customKey ? CryptoJS.enc.Utf8.parse(customKey) : FIXED_KEY
  const encrypted = CryptoJS.AES.encrypt(str, aesKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

export function Decrypt(word: string, customKey?: string) {
  const aesKey = customKey ? CryptoJS.enc.Utf8.parse(customKey) : FIXED_KEY
  const decrypted = CryptoJS.AES.decrypt(word, aesKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}