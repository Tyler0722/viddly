/**
 * Generate random id
 * @param {Number} length Length of id
 * @returns {String} Random generated id
 */
const genId = (length = 12) => {
  const chars = "0123456789";
  let str = "";
  for (let i = 0; i < length; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    str += chars.substring(rnum, rnum + 1);
  }
  return str;
};

module.exports = { genId };
