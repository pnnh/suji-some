var charsNumber = "0123456789";
var charsLetter = "abcdefghijklmnopqrstuvwxyz";
var charsUppercaseLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var charsSymbol = "~!@#$%^&*()_+=-[]}{;:,<>?/.";
function randomString(chars, length) {
    length = length || 32;
    var t = chars, a = t.length, n = "";
    for (var i = 0; i < length; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n;
}
function randomPassword(length, options) {
    var chars = "";
    if (options.number) {
        chars += charsNumber;
    }
    if (options.letter) {
        chars += charsLetter;
    }
    if (options.uppercaseLetter) {
        chars += charsUppercaseLetter;
    }
    if (options.symbol) {
        chars += charsSymbol;
    }
    if (chars.length < 1) {
        chars = charsNumber + charsLetter + charsUppercaseLetter;
    }
    return randomString(chars, length);
}

export default randomPassword;
export { randomString };
