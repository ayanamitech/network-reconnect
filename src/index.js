const util = require('util');
const execPromise = util.promisify(require('child_process').exec);
const { setDelay } = require('./lib');
const tryPing = require('./ping');

let recovering = false;

const recoverCMD = async (cmd) => {
  try {
    await execPromise(cmd);
    console.log(`Executed $ ${cmd} to recover network`);
    return true;
  } catch (e) {
    console.error(`Failed to execute command: ${cmd}`);
    console.error(e);
    return false;
  }
};

const pingTest = async (config, retry) => {
  if (retry !== 0) {
    await setDelay(config.RESTART_AFTER);
  }
  const pingResult = await tryPing(config);
  if (typeof config.statusCallback === 'function') {
    config.statusCallback(pingResult);
  }
  return pingResult;
};

const recoverNetwork = async (config, func) => {
  const recoverResult = await func();
  if (recoverResult === true) {
    const retryPing = await pingTest(config);
    if (retryPing === true) {
      console.log('Network recovered');
      return false;
    }
  }
  return true;
};

const pingCheck = async (config) => {
  let retry = 0;
  if (recovering === true) {
    return;
  }
  while (retry < config.MAX_PING_RETRY) {
    const pingResult = await pingTest(config, retry);
    if (pingResult === true) {
      console.log('Network is online');
      recovering = false;
      return;
    }
    recovering = true;
    retry++;
    if (retry < config.MAX_PING_RETRY) {
      console.log(`Ping test ${retry} failed, will retry ping test after ${config.RESTART_AFTER} seconds`);
    } else {
      console.log(`Ping test ${retry} failed, network on full recovery mode`);
    }
  }
  if (config.ENABLE_RESTART_CMD === true) {
    recovering = await recoverNetwork(config, () => recoverCMD(config.RESTART_CMD));
  }
  if (config.RESTART_CMD_FAILOVER === true) {
    recovering = await recoverNetwork(config, () => recoverCMD(config.RESTART_CMD_FAILOVER_CMD));
  }
  if (typeof config.reconnectCallback === 'function') {
    // Expand recovery function from external library
    recovering = await recoverNetwork(config, config.reconnectCallback);
  }
  console.error('Failed to restart the network from failed ping tests');
  console.error(`Will sleep for ${config.SLEEP_AFTER_FAILURE} seconds to restart the health check`);
  await setDelay(config.SLEEP_AFTER_FAILURE);
  recovering = false;
};

const NetworkReconnect = (config) => {
  pingCheck(config);
  setInterval(() => pingCheck(config), config.PING_CHECK_INTERVAL * 1000);
};

module.exports = NetworkReconnect;
