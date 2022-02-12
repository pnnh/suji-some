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


bool ListBuckets(const Aws::String& bucketName,
                 const Aws::String& region) {
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

int main() {
    std::cout << "Hello, World!" << std::endl;

    Aws::SDKOptions options;
    Aws::InitAPI(options);
    {
        const Aws::String bucket_name = "abcbucket";

        Aws::String region = "ap-east-1";

        if (!ListBuckets(bucket_name, region))
        {
            return 1;
        }
    }
    Aws::ShutdownAPI(options);

    return 0;
}
