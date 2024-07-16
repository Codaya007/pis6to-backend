const Joi = require("joi");
const CustomError = require("../errors/CustomError");

/**
 * Comprueba si el número de cédula ingresado es valido.
 * @param  {string|integer}  ci Número de cédula
 * @return {Boolean}
 */
function isValidCI(ci, helpers) {
  var isNumeric = true;
  var total = 0,
    individual;

  for (var position = 0; position < 10; position++) {
    individual = ci.toString().substring(position, position + 1);

    if (isNaN(individual)) {
      isNumeric = false;
      break;
    } else {
      if (position < 9) {
        if (position % 2 == 0) {
          if (parseInt(individual) * 2 > 9) {
            total += 1 + ((parseInt(individual) * 2) % 10);
          } else {
            total += parseInt(individual) * 2;
          }
        } else {
          total += parseInt(individual);
        }
      }
    }
  }

  if (total % 10 != 0) {
    total = total - (total % 10) + 10 - total;
  } else {
    total = 0;
  }

  if (isNumeric) {
    if (ci.toString().length != 10) {
      throw new CustomError("La cédula debe ser de 10 dígitos.", null, 400);
    }

    if (parseInt(ci, 10) == 0) {
      throw new CustomError(
        "La cédula ingresada no puede ser cero.",
        null,
        400
      );
    }

    if (total != parseInt(individual)) {
      throw new CustomError("La cédula ingresada no es válida.", null, 400);
    }

    return ci; // Devuelve el valor de la cédula si es válida
  }

  throw new CustomError("La cédula debe contener solo números.", null, 400);
}

module.exports = isValidCI;
