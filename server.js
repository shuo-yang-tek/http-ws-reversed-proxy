'use strict';

module.exports = (port, hostname, routes) => {
   const notFoundHandler = (res) => {
      res.writeHead(404, {
         'Content-Type': 'text/plain'
      });

      res.end('[reversed proxy] not found');
   };

   const proxyErrorHandler = (err, req, res) => {
      res.writeHead(500, {
         'Content-Type': 'text/plain'
      });

      res.end('[reversed proxy] ' + err.toString());
   };

   const matchAndPatchReq = (req) => {
      for(let i = 0; i < routes.length; i++) {
         const currRoute = routes[i];

         const tester = new RegExp(currRoute.match);
         const result = tester.exec(req.url);

         if( !result )
            continue;

         req.url = result[1] || '/';
         return currRoute;
      }
   };

   const serverListener = (req, res) => {
      const route = matchAndPatchReq(req);

      if( route )
         proxyApi.web(req, res, { target: 'http://' + route.target });
      else
         notFoundHandler(res);
   };

   const serverUpgradeListener = (req, socket, head) => {
      const route = matchAndPatchReq(req);

      if( route )
         proxyApi.ws(req, socket, head, { target: 'ws://' + route.target });
      else
         socket.destroy(new Error('not found'));
   };

   const proxyApi = require('http-proxy').createProxyServer();
   proxyApi.on('error', proxyErrorHandler);

   const server = require('http').createServer(serverListener);
   server.on('upgrade', serverUpgradeListener);

   server.listen(port, hostname, () => {
      console.log('Reversed proxy server started: %s:%d', hostname, port);
   });
};
