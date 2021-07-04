cmake_minimum_required(VERSION 3.19)
project(some_clion)

set(CMAKE_CXX_STANDARD 20)
set( CMAKE_VERBOSE_MAKEFILE on )

include_directories(${PROJECT_SOURCE_DIR}/libraries)
link_directories(${PROJECT_SOURCE_DIR}/libraries)

# C示例程序
add_executable(cmain src/cmain/main.c)
target_link_libraries(cmain some)

# CPP示例程序
add_executable(cppmain src/cppmain/main.cpp)
target_link_libraries(cppmain some)