add_contract(sum sum
        ${CMAKE_CURRENT_SOURCE_DIR}/src/sum.cpp
        )

target_include_directories(sum
        PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/include)

target_compile_options(sum PUBLIC -no-missing-ricardian-clause)
target_link_libraries(sum b1os)

set_target_properties(sum
        PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}")

add_wasm_abi(sum_abi ${CMAKE_CURRENT_SOURCE_DIR}/abi/sum_abi.cpp)
target_link_libraries(sum_abi b1os)
target_include_directories(sum_abi PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)
