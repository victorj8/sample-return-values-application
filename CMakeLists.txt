cmake_minimum_required(VERSION 3.8)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)
include(EosioWasmToolchain)

project(sample_return_values_application_contracts)

set(VERSION_MAJOR 0)
set(VERSION_MINOR 0)
set(VERSION_PATCH 0)
set(VERSION_SUFFIX develop)

set(EOSIO_EXECUTABLES_PATH "" CACHE PATH "Path to directory containing EOSIO executables")

option(ENABLE_EOS3_STATE_DATA "enable eos3.0 state data" ON)

if (VERSION_SUFFIX)
    set(VERSION_FULL "${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}-${VERSION_SUFFIX}")
else()
    set(VERSION_FULL "${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}")
endif()

message(STATUS "Building test14 Contracts v${VERSION_FULL}")

set(ROOT_BINARY ${CMAKE_CURRENT_BINARY_DIR})
set(ROOT_SOURCE ${CMAKE_CURRENT_SOURCE_DIR})

add_subdirectory(contracts)
