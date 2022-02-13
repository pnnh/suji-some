//
// Created by ubuntu on 2/13/22.
//

#include "init.h"
#include <iostream>
#include <utility>
#include <aws/core/Aws.h>
#include <aws/appconfigdata/AppConfigDataClient.h>
#include <aws/appconfigdata/AppConfigDataRequest.h>
#include <aws/appconfigdata/model/StartConfigurationSessionRequest.h>
#include <aws/appconfigdata/model/StartConfigurationSessionResult.h>
#include <aws/appconfigdata/model/GetLatestConfigurationRequest.h>
#include <aws/appconfigdata/model/GetLatestConfigurationResult.h>


void initAws() {
    Aws::SDKOptions options;
    Aws::InitAPI(options);

    //Aws::ShutdownAPI(options);

}