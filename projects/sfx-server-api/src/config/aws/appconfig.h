//
// Created by ubuntu on 2/13/22.
//

#ifndef SFX_SERVER_API_APPCONFIG_H
#define SFX_SERVER_API_APPCONFIG_H

#include <string>

void initConfig();

std::string GetConfigItem(const std::string &key);

#endif //SFX_SERVER_API_APPCONFIG_H
