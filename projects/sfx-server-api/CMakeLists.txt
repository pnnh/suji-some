cmake_minimum_required(VERSION 3.18)
project(sfx-server-api)

set(CMAKE_CXX_STANDARD 20)

find_package(AWSSDK REQUIRED COMPONENTS s3 appconfig appconfigdata)

add_executable(sfx-server-api main.cpp)

target_link_libraries(sfx-server-api ${AWSSDK_LINK_LIBRARIES}
        ${AWSSDK_PLATFORM_DEPS})

