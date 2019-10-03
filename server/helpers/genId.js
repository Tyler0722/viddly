module.exports = () => {
  const chars = "0123456789";
  const length = 8;
  let str = "";
  for (let i = 0; i < length; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    str += chars.substring(rnum, rnum + 1);
  }
  return str;
};
