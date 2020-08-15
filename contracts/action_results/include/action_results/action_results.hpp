#pragma once
#include <b1os/wasm_abi.hpp>
#include <eosio/eosio.hpp>

using namespace eosio;

namespace action_results {

class [[eosio::contract("action_results")]] action_results_contract : public contract {
  public:
      using contract::contract;

      [[eosio::action]]
      int sum(int valueA, int valueB) {
         return valueA + valueB;
      }

  private:
};

EOSIO_DECLARE_ACTIONS(action_results_contract, "eosio"_n, //
                      sum)

}