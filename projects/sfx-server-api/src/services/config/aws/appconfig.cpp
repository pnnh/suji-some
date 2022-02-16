//
// Created by ubuntu on 2/13/22.
//

#include "appconfig.h"
#include <iostream>
#include <utility>
#include <string>
#include <sstream>
#include <unordered_map>
#include <boost/algorithm/string.hpp>
#include <boost/algorithm/string/split.hpp>
#include <vector>
#include <aws/core/Aws.h>
#include <aws/appconfigdata/AppConfigDataClient.h>
#include <aws/appconfigdata/AppConfigDataRequest.h>
#include <aws/appconfigdata/model/StartConfigurationSessionRequest.h>
#include <aws/appconfigdata/model/StartConfigurationSessionResult.h>
#include <aws/appconfigdata/model/GetLatestConfigurationRequest.h>
#include <aws/appconfigdata/model/GetLatestConfigurationResult.h>

using namespace Aws;
using namespace AppConfigData;

std::unordered_map<std::string, std::string> configMap;

std::string GetConfigItem(const std::string &key) {
    return configMap[key];
}

void buildConfigVector(const std::string configText) {

    std::vector<std::string> words;

    boost::split(words, configText, boost::is_any_of("\n"));
    for (const auto &item: words) {
        //std::cout << "item " << item << std::endl;
        std::size_t index = item.find('=');
        if (index != std::string::npos) {
            auto key = item.substr(0, index);
            auto value = item.substr(index + 1, item.length());
            std::cout << "item key value " << key << "|" << value << std::endl;
            configMap[key] = value;
        }
    }
}

void initConfig() {

    Aws::Client::ClientConfiguration config;

    AppConfigData::AppConfigDataClient appConfigDataClient(config);

    Aws::AppConfigData::Model::StartConfigurationSessionRequest request;
    request.SetApplicationIdentifier("sfx");
    request.SetEnvironmentIdentifier("debug");
    request.SetConfigurationProfileIdentifier("debug.config");

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
            //std::cout << "configText: \n" << configText << std::endl;
            buildConfigVector(configText);

        } else {
            std::cerr << "GetLatestConfiguration Failed " << getConfResult.GetError().GetMessage() << std::endl;
        }

    } else {
        std::cerr << "Failed " << result.GetError().GetMessage() << std::endl;
    }
}