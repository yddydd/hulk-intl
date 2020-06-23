#!/bin/bash

if [[ $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == 'master' ]] || [[ $CI_COMMIT_TAG != '' ]];then
	rm -rf tmp-int
	git clone $CI_TARGET_INTEGRATE_REPO tmp-int
	cd tmp-int
	git checkout $CI_TARGET_INTEGRATE_BRANCH
	mkdir tmp-dep
	mv ../webpack.config.js tmp-dep/
	mv ../package.json tmp-dep/
	mv ../src tmp-dep/

	npm install --registry=http://npm.fe.sensorsdata.cn/
	npx install-local ./tmp-dep

	npm run build

	mv ./dist ../$CI__TARGET_INTEGRATE_OUTPUT_DIRNAME

	if [[ $CI_COMMIT_TAG != '' ]];then
		if [ ${WX_ROBOT_WEBHOOK} == "" ];then
			echo "还未关联微信通知地址，请到 gitlab 的 CI/CD 中的 Variables 页面中设置 WX_ROBOT_WEBHOOK 进行关联"
		else
			curl ${WX_ROBOT_WEBHOOK} \
			-H 'Content-Type: application/json' \
			-d "
			{
		      \"msgtype\": \"markdown\",
		      \"markdown\": {
		          \"content\": \"<font color=\\\"info\\\">${CI_PROJECT_NAME_CN}</font> 尝试更新 tag 至 ${CI_COMMIT_TAG}，请 \n[查看tag](http://gitlab.internal.sensorsdata.cn/${CI_PROJECT_NAMESPACE}/${CI_PROJECT_NAME}/tags/${CI_COMMIT_TAG})\n[下载CI编译包](http://gitlab.internal.sensorsdata.cn/${CI_PROJECT_NAMESPACE}/${CI_PROJECT_NAME}/-/jobs/${CI_JOB_ID}/artifacts/download)\n[操作入库](http://gitlab.internal.sensorsdata.cn/${CI_PROJECT_NAMESPACE}/${CI_PROJECT_NAME}/pipelines/${CI_PIPELINE_ID})\"
		      }
			}"
		fi
	fi
else
	echo '非合并到 master 的分支的 merge_request 或 非 tag 触发，不进行 build';
fi
