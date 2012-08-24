#!/bin/sh

CSENSE_SVN_PATH=/export/scratch/thebault/workspace/server/
DEPLOY_DIR=`pwd`
DATE=`date +%Y-%m-%d_%H:%M`

if [ $# -eq 0 ]; then
    echo "Deploying all wars"
        
    $DEPLOY_DIR/$0 core
	exit 0
fi

if [ "$1" = "core" ]; then
    echo "Building csense.war and dependencies"
    cp build.properties $CSENSE_SVN_PATH/build.properties
    cd $CSENSE_SVN_PATH
    mvn -DskipTests=true --also-make clean package
    cd $DEPLOY_DIR

    echo "Deploying csense.war"
    
    cp server/deploy/tomcat/webapps/csense.war server/deploy/old_wars/csense-$DATE.war
    rm -rf server/deploy/tomcat/webapps/csense
    cp $CSENSE_SVN_PATH/target/citizen-sense-0.0.1-SNAPSHOT.war server/deploy/tomcat/webapps/csense.war
fi

if [ "$1" = "--help" ]; then
    echo "$0 [server_name] "
    echo "   where server_name is one of:"
    echo "     - core (builds the war for the booklens-core server)"
    echo "   If server_name is not provided, all servers are deployed."
fi