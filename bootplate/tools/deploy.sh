#!/bin/bash

# the folder this script is in (*/bootplate/tools)
TOOLS=$(cd `dirname $0` && pwd)

# enyo location
ENYO="$TOOLS/../enyo"

# deploy script location
DEPLOY="$ENYO/tools/deploy.js"

# check for node, but quietly
if command -v node >/dev/null 2>&1; then
	# use node to invoke deploy with imported parameters
	echo "enyo/tools/minify.sh args: " $@
	node "$DEPLOY" $@
else
	echo "No node found in path"
	exit 1
fi

# copy files and package if deploying to cordova webos
while [ "$1" != "" ]; do
	case $1 in
		-w | --cordova-webos )
														# copy appinfo.json and cordova*.js files
														SRC="$TOOLS/../"
														DEST="$TOOLS/../deploy/"${PWD##*/}

														cp "$SRC"appinfo.json $DEST -v
														cp "$SRC"cordova*.js $DEST -v

														# package it up
														mkdir -p "$DEST/bin"
														palm-package "$DEST/bin"
														;;
	esac
	shift
done

if [ "$1" = 'web' ]; then
echo "Copying to server"
scp -r $TARGET/* summatusmentis.com://home/jts/sites/blog/csense
fi

if [ "$1" = 'lweb' ]; then
echo "Copying to local server"
cp -R $TARGET/* ~/Sites
fi

if [ "$1" = 'android' ]; then
echo "Copying to Android project"
cp -r $TARGET/* ~/programming/csense_trunk/app_templates/CitizenSense_Android/assets/www

echo "Deploying to Android project"
~/programming/csense_trunk/app_templates/CitizenSense_Android/cordova/BOOM
fi

if [ "$1" = 'ios' ]; then
echo "Copying to iOS project"
cp -r $TARGET/* ~/programming/csense_trunk/app_templates/CitizenSense_iOS/www

echo "Deploying to iOS project"
~/programming/csense_trunk/app_templates/CitizenSense_iOS/cordova/debug
#if [ -z "$2" ]; then
	#echo "Newest version"
	#~/programming/csense_trunk/app_templates/CitizenSense_iOS/cordova/emulate "6.0"
#else
	~/programming/csense_trunk/app_templates/CitizenSense_iOS/cordova/emulate $2
#fi
fi
