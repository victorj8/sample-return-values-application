add_contract(action_results action_results
        ${CMAKE_CURRENT_SOURCE_DIR}/src/action_results.cpp
        )

target_compile_options(action_results PUBLIC -no-missing-ricardian-clause)

set_target_properties(action_results
        PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}")
