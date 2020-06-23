#!/bin/bash

if [[ $CI_MERGE_REQUEST_TARGET_BRANCH_NAME != 'master' ]];then
  echo '非合并到 master 的分支的 merge_request，不进行 deploy';
else
	rsync -vzrtopg --delete --progress ./$CI__TARGET_INTEGRATE_OUTPUT_DIRNAME ${DEPLOY_PATH_FOR_TEST}
	if [ ${WX_ROBOT_WEBHOOK} == "" ];then
		echo "还未关联微信通知地址，请到 gitlab 的 CI/CD 中的 Variables 页面中设置 WX_ROBOT_WEBHOOK 进行关联"
	else
		curl ${WX_ROBOT_WEBHOOK} \
		-H 'Content-Type: application/json' \
		-d "
		{
	      \"msgtype\": \"markdown\",
	      \"markdown\": {
	          \"content\": \"已更新<font color=\\\"info\\\">${CI_PROJECT_NAME_CN}</font>集成测试环境\nCommit:[${CI_COMMIT_SHORT_SHA}](http://gitlab.sensorsdata.cn/${CI_PROJECT_NAMESPACE}/${CI_PROJECT_NAME}/commit/${CI_COMMIT_SHA})\nPR:[${CI_MERGE_REQUEST_TITLE}](http://gitlab.sensorsdata.cn/${CI_PROJECT_NAMESPACE}/${CI_PROJECT_NAME}/merge_requests/${CI_MERGE_REQUEST_IID})\"
	      }
		}"
	fi
fi
