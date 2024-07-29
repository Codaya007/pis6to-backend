/**
 * Elimina los campos especificados de un objeto JSON.
 * @param {Object} obj - El objeto del cual se eliminarán los campos.
 * @param {Array<string>} fields - Array de nombres de campos a eliminar.
 * @returns {Object} - El objeto con los campos eliminados.
 */
function removeFields(obj, fields) {
  // Copiar el objeto original para no modificarlo directamente
  const newObj = { ...obj };

  // Eliminar cada campo especificado
  fields.forEach((field) => {
    delete newObj[field];
  });

  return newObj;
}

module.exports = {
  removeFields,
};
