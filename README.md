# Network Reconnect Manager

[![Build Status](https://github.com/ayanamitech/network-reconnect/workflows/Node%20lint/badge.svg)](https://github.com/ayanamitech/network-reconnect/actions)
[![NPM Package Version](https://img.shields.io/npm/v/network-reconnect.svg)](https://npmjs.org/package/network-reconnect)
[![NPM Package Downloads](https://img.shields.io/npm/dm/network-reconnect.svg)](https://npmjs.org/package/network-reconnect)
[![Known Vulnerabilities](https://snyk.io/test/github/ayanamitech/network-reconnect/badge.svg?style=flat-square)](https://snyk.io/test/github/ayanamitech/network-reconnect)
[![GitHub Views](https://img.shields.io/badge/dynamic/json?color=green&label=Views&query=uniques&url=https://github.com/ayanamitech/node-github-repo-stats/blob/main/data/ayanamitech/network-reconnect/views.json?raw=True&logo=github)](https://github.com/ayanamitech/network-reconnect)
[![GitHub Clones](https://img.shields.io/badge/dynamic/json?color=success&label=Clone&query=uniques&url=https://github.com/ayanamitech/node-github-repo-stats/blob/main/data/ayanamitech/network-reconnect/clone.json?raw=True&logo=github)](https://github.com/ayanamitech/network-reconnect)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Detect if network is unreachable via ping and will try to recover automatically,

Useful for auto reconnecting OpenVPN connections

### Why?

OpenVPN reconnection is unreliable and it fails to reconnect with OpenVPN server very often.

This Node.js script is to combat this old bug from OpenVPN with automated health tests from VPN client, sending ping request to VPN server IP, and will restart the OpenVPN daemon.

(If this worker fails to recover the network connection, it will just sleep for pre defined time)

### Config

```json
{
  "PING_CHECK": "Comma separated ip address to perfom ping test",
  "PING_CHECK_TIMEOUT": "Timeout seconds for ping tests (Usually it wouldn't be longer than 5~10 seconds)",
  "PING_CHECK_INTERVAL": "How often should we perform ping tests (in seconds)",
  "MAX_PING_RETRY": "How many times should we retry ping tests (2 times would be recommended since ping tests wouldn't be failed too much for normal internet connection)",
  "ENABLE_RESTART_CMD": "true by default (disable this if you have imported this library and willing to use your custom callback function to recover network)",
  "RESTART_CMD": "command to try recover network",
  "RESTART_CMD_FAILOVER": "If you are using RESTART_CMD_FAILOVER_CMD this value should be true",
  "RESTART_CMD_FAILOVER_CMD": "Secondary command to recover network if the first one isn't sufficient to recover the network",
  "RESTART_AFTER": "How many seconds to sleep before checking the network (Recommend value is 120 ~ 300 seconds)",
  "SLEEP_AFTER_FAILURE": "Don't perform any health checks or recovery for this amount of time"
}
```

### Example

```json
{
  "PING_CHECK": "1.1.1.1,1.0.0.1,8.8.8.8,8.8.4.4",
  "PING_CHECK_TIMEOUT": 15,
  "PING_CHECK_INTERVAL": 30,
  "MAX_PING_RETRY": 2,
  "ENABLE_RESTART_CMD": true,
  "RESTART_CMD": "sudo /etc/init.d/networking restart",
  "RESTART_CMD_FAILOVER": false,
  "RESTART_CMD_FAILOVER_CMD": "",
  "RESTART_AFTER": 300,
  "SLEEP_AFTER_FAILURE": 1800
}
```
