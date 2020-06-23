#!/bin/bash

target_repo='git@gitlab.internal.sensorsdata.cn:front-end/sensors-analytics-app.git'
target_branch='release/1.17.0'

rm -rf tmp-int
git clone $target_repo tmp-int
cd tmp-int
git checkout $target_branch
mkdir tmp-dep
cp -r ../webpack.config.js tmp-dep/
cp -r ../package.json tmp-dep/
cp -r ../src tmp-dep/

npm install --registry=http://npm.fe.sensorsdata.cn/
npx install-local ./tmp-dep

echo "Done clone & install , please change webpack proxy config and run npm start"
