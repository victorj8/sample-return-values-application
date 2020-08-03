add_contract(boot boot
        ${CMAKE_CURRENT_SOURCE_DIR}/src/boot.cpp
        )

target_include_directories(boot
        PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/include)

target_compile_options(boot PUBLIC -no-missing-ricardian-clause)
target_link_libraries(boot b1os)

set_target_properties(boot
        PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}")

add_wasm_abi(boot_abi ${CMAKE_CURRENT_SOURCE_DIR}/abi/boot_abi.cpp)
target_link_libraries(boot_abi b1os)
target_include_directories(boot_abi PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)
