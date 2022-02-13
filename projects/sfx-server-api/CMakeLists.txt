cmake_minimum_required(VERSION 3.18)
project(sfx-server-api)

set(CMAKE_CXX_STANDARD 20)

find_package(AWSSDK REQUIRED COMPONENTS s3 appconfig appconfigdata)

add_executable(sfx-server-api main.cpp)

target_link_libraries(sfx-server-api ${AWSSDK_LINK_LIBRARIES}
        ${AWSSDK_PLATFORM_DEPS})

find_package(PkgConfig REQUIRED)

find_package(Boost COMPONENTS system thread REQUIRED)
if (Boost_FOUND)
    message(STATUS "Found Boost: ${FOLLY_LIBRARIES}")
    INCLUDE_DIRECTORIES(${Boost_INCLUDE_DIRS})
    LINK_LIBRARIES(${Boost_LIBRARIES})
endif (Boost_FOUND)

find_package(folly REQUIRED)
if (folly_FOUND)
    message(STATUS "Found folly: ${FOLLY_LIBRARIES}")
    INCLUDE_DIRECTORIES(${folly_INCLUDE_DIRS})
    LINK_LIBRARIES(${FOLLY_LIBRARIES})
endif (folly_FOUND)

add_executable(server
        src/main.cc
        src/http_connection.cc
        src/state.cc
        src/md5.cc src/handlers/index.cpp src/handlers/index.h
        src/utils/mime.h  src/utils/mime.cpp
        src/markdown/markdown.cpp src/markdown/mdtransform.hpp src/markdown/markdown.h)
