const util = require('util');
const execPromise = util.promisify(require('child_process').exec);
const { isWin, formatTime } = require('./lib');

const pingTest = async (ip, config) => {
  try {
    // Windows doesn't allow changing -c option without system admin authorization
    const cmd = isWin ? `ping ${ip}` : `ping -c 5 ${ip}`;
    await execPromise(cmd, { timeout: config.PING_CHECK_TIMEOUT * 1000 });
    return true;
  } catch (e) {
    console.error(`Failed to ping ${ip}`);
    console.error(e);
    return false;
  }
};

const runPing = async (ip, config) => {
  const timeNow = formatTime();
  console.time(`ping ${ip} ${timeNow} `);
  const result = await pingTest(ip, config);
  console.timeEnd(`ping ${ip} ${timeNow} `);
  return result;
};

const tryPing = async (config) => {
  const result = await Promise.all(config.PING_CHECK.split(',').map(h => runPing(h, config)));
  if (result.filter(r => r === false).length === result.length) {
    console.error('All tests failed');
    return false;
  }
  console.log('Ping test completed');
  return true;
};

module.exports = tryPing;
