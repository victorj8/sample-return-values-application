cmake_minimum_required(VERSION 3.8)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)
include(EosioWasmToolchain)

project(test14_contracts)

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

function(add_wasm_abi TARGET SRC)
    add_contract(${TARGET} ${TARGET} ${SRC})
    target_compile_options(${TARGET} PUBLIC -fcustom --headers embed)
    target_link_libraries(${TARGET} b1os)
    target_link_options(${TARGET} PUBLIC
        -fcustom
        --entry initialize
        "SHELL:--export-fn get_actions"
        "SHELL:--export-fn action_args_json_to_bin"
        "SHELL:--export-fn action_args_bin_to_json"
        "SHELL:--export-fn action_ret_bin_to_json"
        -l eosio_embed
    )
endfunction()

add_subdirectory(libraries)
add_subdirectory(contracts)
