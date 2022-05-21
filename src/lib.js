const isWin = process.platform === 'win32';

const setDelay = (secs = 1) => new Promise(resolve => setTimeout(() => resolve(), secs * 1000));

const formatTime = () => {
  const time = new Date();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const year = time.getFullYear();
  const rawHours = time.getHours();
  const hours = (rawHours > 12) ? rawHours - 12 : rawHours;
  const minutes = time.getMinutes();
  const abbreviations = (rawHours > 12) ? 'PM' : 'AM';
  return `${month}/${day}/${year} ${hours}:${minutes} ${abbreviations}`;
};

module.exports = {
  isWin,
  setDelay,
  formatTime
};
