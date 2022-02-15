cmake_minimum_required(VERSION 3.18)
project(sfx-server-api)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_VERBOSE_MAKEFILE on)
set(CMAKE_INCLUDE_CURRENT_DIR ON)

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

find_package(AWSSDK REQUIRED COMPONENTS s3 appconfig appconfigdata)

add_executable(sfx-server-api
        src/config/aws/init.cpp src/config/aws/init.h
        src/main.cc
        src/http_connection.cc
        src/state.cc
        src/md5.cc src/handlers/index.cpp src/handlers/index.h
        src/utils/mime.h src/utils/mime.cpp
        src/markdown/markdown.cpp src/markdown/mdtransform.hpp src/markdown/markdown.h
        src/config/aws/appconfig.cpp src/config/aws/appconfig.h src/database/postgresql/pq.cpp src/database/postgresql/pq.h src/database/postgresql/init.cpp src/database/postgresql/init.h)

find_library(PQXX_LIB pqxx)
find_library(PQ_LIB pq)

target_link_libraries(sfx-server-api ${AWSSDK_LINK_LIBRARIES}
        ${AWSSDK_PLATFORM_DEPS})
target_link_libraries(sfx-server-api ${PQXX_LIB} ${PQ_LIB})