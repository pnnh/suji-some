package utils

import ch.qos.logback.core.encoder.ByteArrayUtil.toHexString
import java.security.SecureRandom
import java.util.*
import javax.crypto.Cipher
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.SecretKeySpec


class AESCrypt {
    companion object {
        private const val SALT_LENGTH = 16
        /**
         * aes加密
         */
        fun encrypt(input: String, password: String): String {
            val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
            val keySpec = SecretKeySpec(password.toByteArray(),"AES")
            val ivParameterSpec = IvParameterSpec(ByteArray(cipher.blockSize))
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivParameterSpec)
            val encrypt = cipher.doFinal(input.toByteArray())
            val bytes = generateSalt(SALT_LENGTH).plus(encrypt)
            val out = String(Base64.getUrlEncoder().encode(bytes))
            return out
        }

        fun generateSalt(length: Int): ByteArray {
            val random: SecureRandom = SecureRandom.getInstance("SHA1PRNG")
            val salt = ByteArray(length)
            random.nextBytes(salt)
            return salt
        }

        /**
         * aes解密
         */
        fun decrypt(input: String, password: String): String {
            val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
            val bytes = Base64.getUrlDecoder().decode(input)
            val encrypted = bytes.copyOfRange(SALT_LENGTH, bytes.count())
            val keySpec = SecretKeySpec(password.toByteArray(),"AES")
            val ivParameterSpec = IvParameterSpec(ByteArray(cipher.blockSize))
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivParameterSpec)

            val decrypt = cipher.doFinal(encrypted)
            return String(decrypt)
        }
    }
}