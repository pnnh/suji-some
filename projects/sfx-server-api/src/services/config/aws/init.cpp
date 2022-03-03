//
// Created by ubuntu on 2/13/22.
//

#include "init.h"
#include <iostream>
#include <utility>
#include <aws/core/Aws.h>
#include <aws/appconfigdata/AppConfigDataClient.h>


void initAws() {
    Aws::SDKOptions options;

    Aws::InitAPI(options);

    //Aws::ShutdownAPI(options);

}