(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['exports', 'kotlin'], factory);
  else if (typeof exports === 'object')
    factory(module.exports, require('kotlin'));
  else {
    if (typeof kotlin === 'undefined') {
      throw new Error("Error loading module 'some_library'. Its dependency 'kotlin' was not found. Please, check whether 'kotlin' is loaded prior to 'some_library'.");
    }root.some_library = factory(typeof some_library === 'undefined' ? {} : some_library, kotlin);
  }
}(this, function (_, Kotlin) {
  'use strict';
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

//# sourceMappingURL=some_library.js.map
