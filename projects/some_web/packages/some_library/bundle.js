import require$$0 from 'kotlin';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var some_library = {exports: {}};

(function (module, exports) {
(function (root, factory) {
  factory(module.exports, require$$0);
}(commonjsGlobal, function (_, Kotlin) {
  var Random = Kotlin.kotlin.random.Random;
  var charsNumber;
  var charsLetter;
  var charsUppercaseLetter;
  var charsSymbol;
  function randomString(chars, length) {
    if (chars.length === 0 || length < 1) {
      return '';
    }var i = 0;
    var out = '';
    while (i < length) {
      i = i + 1 | 0;
      var index = 0;
      if (chars.length > 1) {
        index = Random.Default.nextInt_vux9f0$(0, chars.length);
      }out += String.fromCharCode(chars.charCodeAt(index));
    }
    return out;
  }
  function randomPassword(length, number, letter, uppercaseLetter, symbol) {
    if (number === void 0)
      number = true;
    if (letter === void 0)
      letter = true;
    if (uppercaseLetter === void 0)
      uppercaseLetter = true;
    if (symbol === void 0)
      symbol = true;
    var chars = '';
    if (number) {
      chars += charsNumber;
    }if (letter) {
      chars += charsLetter;
    }if (uppercaseLetter) {
      chars += charsUppercaseLetter;
    }if (symbol) {
      chars += charsSymbol;
    }if (chars.length === 0) {
      chars = charsNumber + charsLetter + charsUppercaseLetter + charsSymbol;
    }return randomString(chars, length);
  }
  var package$utils = _.utils || (_.utils = {});
  package$utils.randomString = randomString;
  package$utils.randomPassword = randomPassword;
  charsNumber = '0123456789';
  charsLetter = 'abcdefghijklmnopqrstuvwxyz';
  charsUppercaseLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  charsSymbol = '~!@#$%^&*()_+=-[]}{;:,<>?/.';
  Kotlin.defineModule('some_library', _);
  return _;
}));


}(some_library));

var some_library_1 = some_library.exports;

var abc = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.assign(/*#__PURE__*/Object.create(null), some_library.exports, {
	'default': some_library_1
}));

export default abc;
