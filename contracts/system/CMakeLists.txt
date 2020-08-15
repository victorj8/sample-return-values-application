add_contract(system system
        ${CMAKE_CURRENT_SOURCE_DIR}/src/system.cpp
        )

target_include_directories(system
        PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/include)

target_compile_options(system PUBLIC -no-missing-ricardian-clause)
target_link_libraries(system b1os)

set_target_properties(system
        PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}")

add_wasm_abi(system_abi ${CMAKE_CURRENT_SOURCE_DIR}/abi/system_abi.cpp)
target_link_libraries(system_abi b1os)
target_include_directories(system_abi PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)
target_link_libraries(system_abi b1os)

add_custom_command(TARGET system POST_BUILD
    COMMAND ${CMAKE_CURRENT_SOURCE_DIR}/fix-system-abi.sh
    WORKING_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}"
    COMMENT "Use sed to fix invalid abi"
)
