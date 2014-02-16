#!/bin/bash

# the folder this script is in (*/bootplate/tools)
TOOLS=$(cd `dirname $0` && pwd)
PWD=$(pwd)

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

echo "Copying Files to phonegap"
cp -r deploy/bootplate_22/* ../FolkSource/www/
echo "Temporarily moving to the phonegap dir"
cd ../FolkSource
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
		-a | --cordova-android )
														phonegap local run android
														;;
		-i | --cordova-ios )
														phonegap local build ios
														#phonegap local run ios
														;;
		-ib )
														mv platforms/ios/cordova/build.xcconfig platforms/ios/cordova/build.xcconfig.backup
														mv platforms/ios/cordova/build.xcconfig_bad platforms/ios/cordova/build.xcconfig
														mv platforms/ios/cordova/build platforms/ios/cordova/build.backup
														mv platforms/ios/cordova/build_bad platforms/ios/cordova/build
														phonegap local build ios
														echo "Signing Code"
														codesign -fs "fs_test" platforms/ios/build/device/FolkSource.app
														echo "copying to $2"
														scp -r platforms/ios/build/device/FolkSource.app/ root@$2:/Applications
														echo "resetting cache, re-springing, and ending"
														ssh mobile@$2 'uicache && exit'
														ssh root@$2 'killall -HUP SpringBoard && exit'
														mv platforms/ios/cordova/build platforms/ios/cordova/build_bad
														mv platforms/ios/cordova/build.backup platforms/ios/cordova/build
														mv platforms/ios/cordova/build.xcconfig platforms/ios/cordova/build.xcconfig_bad
														mv platforms/ios/cordova/build.xcconfig.backup platforms/ios/cordova/build.xcconfig
														;;
	esac
	shift
done
echo "Moving back to the project dir"
cd $PWD
