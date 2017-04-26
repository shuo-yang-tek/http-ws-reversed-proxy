'use strict';

const fs = require('fs');
const path = require('path');

const filename = path.join(__dirname, 'config.json');

const config = JSON.parse(fs.readFileSync(filename));

require('../server')(config.port, config.hostname, config.routes);
