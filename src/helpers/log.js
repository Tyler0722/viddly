export const log = (...message) => {
  const timestamp = new Date();
  console.log(`[${timestamp.toLocaleTimeString()}] ${message.join(' ')}`);
};