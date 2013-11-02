#!/bin/sh

CATALINA_HOME=/Users/jts/programming/apache-tomcat-7.0.22

CSENSE_DEPLOY_DIR=`pwd`

if [ $# -eq 0 ]; then
   $CSENSE_DEPLOY_DIR/$0 core
    exit 0
fi

if [ "$1" = "core" ]; then
    echo "Starting core server"
    export CATALINA_BASE=$CSENSE_DEPLOY_DIR/server/deploy/tomcat
    $CATALINA_HOME/bin/catalina.sh start
fi

if [ "$1" = '--help' ]; then
    echo "$0 [server_name]"
    echo "   where server_name is one of:"
    echo "     - core (starts the booklens-core tomcat server)"
fi
