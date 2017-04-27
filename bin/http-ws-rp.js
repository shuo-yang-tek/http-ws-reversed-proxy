#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const ping = require('ping');

const configFilename = path.join('/etc/http-ws-rp/config.json');
const config = JSON.parse( fs.readFileSync(configFilename) );

const retryTimeout = config.retryTimeout || 15000;
const start = Date.now();

const checker = (cb) => {
   ping.sys.probe(config.hostname, (isAlive) => {
      if( isAlive )
         cb(true);
      else if( Date.now() > start + retryTimeout )
         cb(false);
      else
         checker(cb);
   });
};

console.log('Waitting for %s ...', config.hostname);

checker((success) => {
   if( success )
      require('../server')(config.port, config.hostname, config.routes);
   else
      throw new Error('cannot find ' + config.hostname);
});
