# Forever
````
PS C:\Users\u610166\Documents\curso> 

 Session contents restored from 29/12/2021 at 07:28:13 


PS C:\Users\u610166\Documents\curso> forever -v --version
v4.0.1
(Use `node --trace-warnings ...` to show where the warning was created)
PS C:\Users\u610166\Documents\curso> forever -v --version
v4.0.1
(node:23816) Warning: Accessing non-existent property 'padLevels' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
PS C:\Users\u610166\Documents\curso> cd C:\Users\u610166\Documents\curso\cursoBackend\WebSockets
PS C:\Users\u610166\Documents\curso\cursoBackend\WebSockets> forever start ./src/main.js
C:\Users\u610166\AppData\Roaming\npm\node_modules\forever\node_modules\configstore\index.js:65
                        throw error;
                        ^

Error: EPERM: operation not permitted, rename 'C:\Users\u610166\.forever\config.json.617063719' -> 'C:\Users\u610166\.forever\config.json'
    at Object.renameSync (node:fs:980:3)
    at Function.writeFileSync [as sync] (C:\Users\u610166\AppData\Roaming\npm\node_modules\forever\node_modules\write-file-atomic\index.js:224:8)
    at Configstore.set all [as all] (C:\Users\u610166\AppData\Roaming\npm\node_modules\forever\node_modules\configstore\index.js:58:20)
    at Configstore.set (C:\Users\u610166\AppData\Roaming\npm\node_modules\forever\node_modules\configstore\index.js:88:12)
    at Object.forever.load (C:\Users\u610166\AppData\Roaming\npm\node_modules\forever\lib\forever.js:331:18)
    at Object.<anonymous> (C:\Users\u610166\AppData\Roaming\npm\node_modules\forever\lib\forever.js:378:9)
    at Module._compile (node:internal/modules/cjs/loader:1101:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12) {
  errno: -4048,
  syscall: 'rename',
  code: 'EPERM',
  path: 'C:\\Users\\u610166\\.forever\\config.json.617063719',
  dest: 'C:\\Users\\u610166\\.forever\\config.json'
}

````
# PM2
````
C:\Users\u610166>pm2 --version

                        -------------

__/\\\\\\\\\\\\\____/\\\\____________/\\\\____/\\\\\\\\\_____
 _\/\\\/////////\\\_\/\\\\\\________/\\\\\\__/\\\///////\\\___
  _\/\\\_______\/\\\_\/\\\//\\\____/\\\//\\\_\///______\//\\\__
   _\/\\\\\\\\\\\\\/__\/\\\\///\\\/\\\/_\/\\\___________/\\\/___
    _\/\\\/////////____\/\\\__\///\\\/___\/\\\________/\\\//_____
     _\/\\\_____________\/\\\____\///_____\/\\\_____/\\\//________
      _\/\\\_____________\/\\\_____________\/\\\___/\\\/___________
       _\/\\\_____________\/\\\_____________\/\\\__/\\\\\\\\\\\\\\\_
        _\///______________\///______________\///__\///////////////__


                          Runtime Edition

        PM2 is a Production Process Manager for Node.js applications
                     with a built-in Load Balancer.

                Start and Daemonize any application:
                $ pm2 start app.js

                Load Balance 4 instances of api.js:
                $ pm2 start api.js -i 4

                Monitor in production:
                $ pm2 monitor

                Make pm2 auto-boot at server restart:
                $ pm2 startup

                To go further checkout:
                http://pm2.io/


                        -------------

connect EPERM //./pipe/rpc.sock
[PM2] Spawning PM2 daemon with pm2_home=C:\Users\u610166\.pm2
node:events:368
      throw er; // Unhandled 'error' event
      ^

Error: connect EPERM //./pipe/rpc.sock
    at PipeConnectWrap.afterConnect [as oncomplete] (node:net:1161:16)
Emitted 'error' event on ReqSocket instance at:
    at Socket.<anonymous> (C:\Users\u610166\AppData\Roaming\npm\node_modules\pm2\node_modules\pm2-axon\lib\sockets\sock.js:201:49)
    at Socket.emit (node:events:390:28)
    at emitErrorNT (node:internal/streams/destroy:157:8)
    at emitErrorCloseNT (node:internal/streams/destroy:122:3)
    at processTicksAndRejections (node:internal/process/task_queues:83:21) {
  errno: -4048,
  code: 'EPERM',
  syscall: 'connect',
  address: '//./pipe/rpc.sock'
}

````
