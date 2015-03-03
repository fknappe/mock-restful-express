#!/bin/sh
# chkconfig: 2345 95 20
# description: Node Express Mock Server
# Lockdown Mock server to run as service
# processname: mock-server

export FOREVER_ROOT=/var/mock-server

case "$1" in
  start)
  exec /opt/node_modules/.bin/forever --sourceDir=/opt/mock-restful-express start --uid "mock-server" -o mock-server-out.log -e mock-server-err.log -a mock-server.js
  ;;

  stop)
  exec /opt/node_modules/.bin/forever --sourceDir=/opt/mock-restful-express stop mock-server
  ;;

  restart)
  exec /opt/node_modules/.bin/forever --sourceDir=/opt/mock-restful-express restart mock-server
  ;;

  list)
  exec /opt/node_modules/.bin/forever --sourceDir=/opt/mock-restful-express list
  ;;
esac

exit 0