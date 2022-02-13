//
// Created by ubuntu on 2/13/22.
//

#include "appconfig.h"
#include <iostream>
#include <utility>
#include <aws/core/Aws.h>
#include <aws/appconfigdata/AppConfigDataClient.h>
#include <aws/appconfigdata/AppConfigDataRequest.h>
#include <aws/appconfigdata/model/StartConfigurationSessionRequest.h>
#include <aws/appconfigdata/model/StartConfigurationSessionResult.h>
#include <aws/appconfigdata/model/GetLatestConfigurationRequest.h>
#include <aws/appconfigdata/model/GetLatestConfigurationResult.h>

using namespace Aws;
using namespace AppConfigData;


bool ListBuckets(const std::string& bucketName,
                 const std::string& region) {

    Aws::Client::ClientConfiguration config;

    if (!region.empty()) {
        config.region = region;
    }
    AppConfigData::AppConfigDataClient appConfigDataClient(config);

    Aws::AppConfigData::Model::StartConfigurationSessionRequest request;
    request.SetApplicationIdentifier("sfx");
    request.SetEnvironmentIdentifier("release");
    request.SetConfigurationProfileIdentifier("release.config");

    auto result = appConfigDataClient.StartConfigurationSession(request);
    if (result.IsSuccess()) {
        std::cout << "Success ";
        auto initToken = result.GetResult().GetInitialConfigurationToken();
        //std::cout << initToken << std::endl;

        Aws::AppConfigData::Model::GetLatestConfigurationRequest request;
        request.WithConfigurationToken(initToken);

        auto getConfResult = appConfigDataClient.GetLatestConfiguration(request);
        if (getConfResult.IsSuccess()) {
            std::cout << "GetLatestConfiguration Success ";
            //auto config = getConfResult.GetResult().GetConfiguration();
            std::stringstream ss;
            ss << getConfResult.GetResult().GetConfiguration().rdbuf();
            auto configText = ss.str();
            std::cout << configText << std::endl;
        } else {
            std::cerr << "GetLatestConfiguration Failed " << getConfResult.GetError().GetMessage() << std::endl;
        }

    } else {
        std::cerr << "Failed " << result.GetError().GetMessage() << std::endl;
    }
    return true;
}