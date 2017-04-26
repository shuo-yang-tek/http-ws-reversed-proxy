Install
===

`sudo npm install -g https://github.com/shuo-yang-tek/http-ws-reversed-proxy.git`

Config
===

* Example: `/etc/http-ws-rp/config.json`

```js
{
   "hostname": "192.168.0.150",
   "port": "8120",
   "routes": [
      {
         "match": "^\/test1(\/.*)?$",
         "target": "127.1.1.1:1111"
      },
      {
         "match": "^\/test2(\/.*)?$",
         "target": "127.2.2.2:2222"
      }
   ]
}
```

* `routes` order matters

* `req.url = (new Regex(match)).exec()[1]`

Start manully
===

`http-ws-rp`

Start via systemd
===

* Example: `/etc/systemd/http-ws-rp.service`

```
[Unit]
Description=Start http-ws-reversed-proxy
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
ExecStart=/usr/bin/http-ws-rp
```
