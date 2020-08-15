add_contract(action_results action_results
        ${CMAKE_CURRENT_SOURCE_DIR}/src/action_results.cpp
        )

target_include_directories(action_results
        PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/include)

target_compile_options(action_results PUBLIC -no-missing-ricardian-clause)
target_link_libraries(action_results b1os)

set_target_properties(action_results
        PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}")

add_wasm_abi(action_results_abi ${CMAKE_CURRENT_SOURCE_DIR}/abi/action_results_abi.cpp)
target_link_libraries(action_results_abi b1os)
target_include_directories(action_results_abi PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)
