#!/usr/bin/env node
const process = require('process');
const loadConfig = require('use-config-json');
const NetworkReconnect = require('./index');

const defaultConfig = {
  'PING_CHECK': '1.1.1.1,1.0.0.1,8.8.8.8,8.8.4.4',
  'PING_CHECK_TIMEOUT': 15,
  'PING_CHECK_INTERVAL': 30,
  'MAX_PING_RETRY': 2,
  'ENABLE_RESTART_CMD': true,
  'RESTART_CMD': 'sudo /etc/init.d/networking restart',
  'RESTART_CMD_FAILOVER': false,
  'RESTART_CMD_FAILOVER_CMD': '',
  'RESTART_AFTER': 300,
  'SLEEP_AFTER_FAILURE': 1800
};

const NetworkRestart = () => {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.log('USAGE');
    console.log('  $ check-net <config file>','\n');
    console.log('DESCRIPTION');
    console.log('  Will perform automatic network recovery based on ping tests','\n');
    console.log('EXAMPLES');
    console.log('  $ check-net config.json');
    console.log('  $ check-net config-vpn.json');
    return;
  }
  const config = loadConfig(defaultConfig, args[0]);
  console.log(`NetworkRestart Config: ${JSON.stringify(config, null, 2)}`);
  NetworkReconnect(config);
};

NetworkRestart();
