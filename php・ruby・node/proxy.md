# proxyの設定

## システム環境変数（comporser）

```
HTTP_PROXY
http://<プロキシサーバ名>:<port>
```

```
HTTPS_PROXY
http://<プロキシサーバ名>:<port>
```

```
HTTP_PROXY_REQUEST_FULLURI
0 or false
```

```
HTTPS_PROXY_REQUEST_FULLURI
0 or false
```

## npm(node)

```
npm -g config set proxy http://<プロキシサーバ名>:<port>
npm -g config set https-proxy http://<プロキシサーバ名>:<port>
npm -g config set registry http://registry.npmjs.org/
npm config list
```

## gem(ruby)

```
set http_proxy=http://<プロキシサーバ名>:<port>
set https_proxy=http://<プロキシサーバ名>:<port>
```