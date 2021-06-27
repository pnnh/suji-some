package utils

import kotlin.random.Random

expect annotation class Name(val name:String)

private const val charsNumber = "0123456789"
@Suppress("SpellCheckingInspection")
private const val charsLetter = "abcdefghijklmnopqrstuvwxyz"
@Suppress("SpellCheckingInspection")
private const val charsUppercaseLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
private const val charsSymbol = "~!@#$%^&*()_+=-[]}{;:,<>?/."

/**
 * 生成随机字符串
 *
 * @param chars 字符范围
 * @param length 预期长度
 * @return 随机字符串
 */
@Name("randomString")
fun randomString(chars: String, length: Int): String {
    if(chars.isEmpty() || length < 1) {
        return ""
    }
    var i = 0
    var out = ""
    while(i < length) {
        i++
        var index = 0
        if(chars.length > 1){
            index = Random.nextInt(0, chars.length)
        }
        out += chars[index]
    }
    return out
}

/**
 * 生成随机密码
 *
 * @param length 预期长度
 * @param number 是否包含数字
 * @param letter 是否包含小写字母
 * @param uppercaseLetter 是否包含大写字母
 * @param symbol 是否包含符号
 * @return 随机密码
 */
@Name("randomPassword")
fun randomPassword(length: Int, number: Boolean = true,
                   letter: Boolean = true,
                   uppercaseLetter: Boolean = true,
                   symbol: Boolean = true): String {
    var chars = ""
    if (number) {
        chars += charsNumber
    }
    if (letter) {
        chars += charsLetter
    }
    if (uppercaseLetter) {
        chars += charsUppercaseLetter
    }
    if (symbol) {
        chars += charsSymbol
    }
    if (chars.isEmpty()) {
        chars = charsNumber + charsLetter + charsUppercaseLetter + charsSymbol
    }
    return randomString(chars, length)
}
