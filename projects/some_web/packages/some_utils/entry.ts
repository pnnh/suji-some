const charsNumber = "0123456789"
const charsLetter = "abcdefghijklmnopqrstuvwxyz"
const charsUppercaseLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const charsSymbol = "~!@#$%^&*()_+=-[]}{;:,<>?/."

export function randomString(chars: string, length: number) {
    length = length || 32;
    let t = chars, a = t.length, n = "";
    for (let i = 0; i < length; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

interface randomPasswordOptions {
    number?: boolean
    letter?: boolean
    uppercaseLetter?: boolean
    symbol?: boolean
}

export default function randomPassword(length: number, options: randomPasswordOptions) {
    let chars = ""
    if (options.number) {
        chars += charsNumber
    }
    if(options.letter) {
        chars += charsLetter;
    }
    if(options.uppercaseLetter) {
        chars += charsUppercaseLetter;
    }
    if(options.symbol) {
        chars += charsSymbol;
    }
    if (chars.length < 1) {
        chars = charsNumber + charsLetter + charsUppercaseLetter;
    }
    return randomString(chars, length);
}
