const moment = require('moment');

function required(attr, value, returnError = false) {
  let error = false;
  if (value == undefined) {
    error = true;
  } else if (typeof value === 'string' && value.trim() === '') {
    error = true;
  } else if (typeof value === 'object' && value.length === 0) {
    error = true;
  }
  if (error) {
    const errorMessage = `${attr} is a required field.`;
    if (returnError === true) {
      return errorMessage;
    }
    throw new Error(errorMessage);
  }
}

function checkMaxLength(attr, value, maxLength = 50, removeNewLine = true) {
  if (value && removeNewLine === true) {
    value = value.replace(/(\r\n|\n|\r)/gm, '');
  }
  if (value && value.trim().length > maxLength) {
    const message = `must not exceed ${maxLength} characters.`;
    throw new Error(`${attr} ` + `${message}`);
  } else {
    return true;
  }
}

function checkMinLength(attr, value, minLength = 50, removeNewLine = true) {
  if (value && removeNewLine === true) {
    value = value.replace(/(\r\n|\n|\r)/gm, '');
  }
  if (value && value.trim().length < minLength) {
    const message = `must not be less than ${minLength} characters.`;
    throw new Error(`${attr} ` + `${message}`);
  } else {
    return true;
  }
}

function numeric(attr, value, returnError = false) {
  if (value) {
    if (
      !new RegExp(/^\d+([.]?\d{0,3})?$/g).test(value) &&
      new RegExp(/\D/g).test(value)
    ) {
      const errorMessage = `${attr} must be only numeric value.`;
      if (returnError === true) {
        return errorMessage;
      }
      throw new Error(errorMessage);
    }
  }
}

function acceptNumeric(attr, value) {
  if (value) {
    if (
      !new RegExp(/^-?\d+([.]?\d{0,3})?$/g).test(value) &&
      new RegExp(/\D/g).test(value)
    ) {
      const message = 'must be only numeric value.';
      throw new Error(`${attr}` + `${message}`);
    }
  }
}

function alphaNumeric(attr, value) {
  if (value && !new RegExp('^[a-zA-Z0-9-#@*&]*$').test(value)) {
    const message = 'must contain only a-z, A-Z, 0-9, (#@*&).';
    throw new Error(`${attr}` + `${message}`);
  }
}

function maxLength(attr, value, length = 50) {
  if (value && value.length > length) {
    let message = `must not exceed ${length} characters.`;
    throw new Error(`${attr}` + `${message}`);
  }
}

function minLength(attr, value, length = 20) {
  if (value && value.length < length) {
    let message = `must not be less than ${length} characters.`;
    throw new Error(`${attr}` + `${message}`);
  }
}

function between(attr, value, min = 8, max = 12) {
  if ((value && value !== '' && value.length < min) || value.length > max) {
    const message = `length must be between ${min} - ${max}.`;
    throw new Error(`${attr}` + ` ${message}`);
  }
}

function minValue(attr, value, min = 1, returnError = false) {
  if (value && value !== '' && value < min) {
    const errorMessage = `${attr} must be greater than or equal to ${min}`;
    if (returnError === true) {
      return errorMessage;
    }
    throw new Error(errorMessage);
  }
}

function onlyNum(attr, value) {
  if (value && value !== '' && /\D/g.test(value)) {
    const message = 'must contain only numbers.';
    throw new Error(`${attr}` + `${message}`);
  }
}

function onlyNumIncludeDash(attr, value) {
  if (value && value !== '' && !/^[0-9-]*$/.test(value)) {
    const message = 'must contain only numbers and dash.';
    throw new Error(`${attr}` + ` ${message}`);
  }
}

function validateUuidv4(uuid) {
  let uuidRegex =
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  return uuidRegex.test(uuid);
}

function validateDateTimeFormat(
  dateTime,
  format = ['YYYY/MM/DD HH:mm'],
  text = ''
) {
  if (
    dateTime &&
    dateTime !== '' &&
    !moment(dateTime, format, true).isValid()
  ) {
    const proMsg = text;
    const message = 'Invalid date';
    throw new Error(`${proMsg}` + ` ${message}`);
  }
}

function validateDate(msg, value) {
  if (
    value &&
    !moment(value, 'YYYY/MM/DD', true).isValid() &&
    !moment(value, 'YYYY-MM-DD', true).isValid()
  ) {
    throw new Error(msg);
  }
  return true;
}

function genericError(msg) {
  throw new Error(msg);
}

function isValidEmail(email) {
  let emailRegex =
    // eslint-disable-next-line
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isEmail = emailRegex.test(email);
  if (!isEmail) {
    throw new Error('The email you have provided is not valid.');
  } else {
    return true;
  }
}

function isValidURL(attr, url) {
  let urlRegex = new RegExp(
    // eslint-disable-next-line no-useless-escape
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  ); // fragment locator
  const isURL = urlRegex.test(url);
  if (!isURL) {
    throw new Error(`${attr}` + ` url you have provided is not valid.`);
  } else {
    return true;
  }
}

function threePhaseLineFileValidation(files, type, length = 1, max = 1000000) {
  if (files) {
    if (!Array.isArray(files)) {
      files = [files];
    }
    if (files.length > length) {
      throw new Error(`Maximum ${length} images can be uploaded in ${type}!`);
    }
    files.forEach((item) => {
      if (item.size > max) {
        throw new Error('File size must not exceed 1 mb.');
      }
      hasValidExtension(item.mimetype);
    });
  }
}

function checkMultipleFileValidation(size, files, message, extensions) {
  if (files) {
    if (!Array.isArray(files)) {
      files = [files];
    }
    files.forEach((item) => {
      if (size) {
        maxFileSize(item.size);
      }
      hasValidExtension(item.mimetype, message, extensions);
    });
  }
}

function hasValidExtension(
  fileExt,
  message = 'Please provide valid image.',
  extensions = ['image/jpeg', 'image/png', 'image/jpg'],
  returnError = false
) {
  if (!extensions.includes(fileExt)) {
    if (returnError === true) {
      return message;
    }
    throw new Error(message);
  }
}

function maxFileSize(fileSize, max = 2000000, returnError = false) {
  if (fileSize > max) {
    let message = 'File size must not exceed 2 mb.';
    if (returnError === true) {
      return message;
    }
    throw new Error(message);
  }
}

function validLatitude(value) {
  const latitudeRegex = new RegExp(
    /^(\+|-)?(?:90(?:(?:\.0{1,20})?)|(?:\d|[1-8]\d)(?:(?:\.\d{1,20})?))$/
  );
  if (!latitudeRegex.test(value)) {
    throw new Error('Enter a valid latitude.');
  }
}

function validLongitude(value) {
  const longitudeRegex = new RegExp(
    /^(\+|-)?(?:180(?:(?:\.0{1,20})?)|(?:\d|[1-9]\d|1[0-7]\d)(?:(?:\.\d{1,20})?))$/
  );
  if (!longitudeRegex.test(value)) {
    throw new Error('Enter a valid longitude.');
  }
}

function validNepaliPhoneNumber(value) {
  const phoneNumberRegex = new RegExp(/^[9][6-8]{1}\d{8}$/);
  if (!phoneNumberRegex.test(value)) {
    throw new Error('Enter a valid phone number');
  }
}

function notBlankEntry(attr, value) {
  if (value === '' || value === null) {
    throw new Error(`${attr} cannot have a blank value.`);
  }
}

module.exports = {
  required,
  checkMaxLength,
  checkMinLength,
  numeric,
  alphaNumeric,
  maxLength,
  validateUuidv4,
  validateDateTimeFormat,
  validateDate,
  acceptNumeric,
  genericError,
  between,
  onlyNum,
  onlyNumIncludeDash,
  minLength,
  isValidEmail,
  isValidURL,
  hasValidExtension,
  checkMultipleFileValidation,
  threePhaseLineFileValidation,
  maxFileSize,
  minValue,
  validLatitude,
  validLongitude,
  validNepaliPhoneNumber,
  notBlankEntry
};
