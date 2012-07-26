#!/bin/sh

CATALINA_HOME=/export/scratch/tomcat7/apache-tomcat-7.0.22

CSENSE_DEPLOY_DIR=`pwd`

if [ $# -eq 0 ]; then
    echo "Stopping all servers"
    $CSENSE_DEPLOY_DIR/$0 core
    exit 0
fi

if [ "$1" = "core" ]; then
    echo "Stopping core server"
    export CATALINA_BASE=$CSENSE_DEPLOY_DIR/server/deploy/tomcat
    $CATALINA_HOME/bin/catalina.sh stop
fi

if [ "$1" = '--help' ]; then
    echo "$0 [server_name]"
    echo "   where server_name is one of:"
    echo "     - core (stops the csense tomcat server)"

fi