#pragma once
#include <b1os/wasm_abi.hpp>
#include <eosio/eosio.hpp>

using namespace eosio;

namespace sum {

class [[eosio::contract("sum")]] sum_contract : public contract {
  public:
      using contract::contract;

      [[eosio::action]]
      int sum(int valueA, int valueB) {
         return valueA + valueB;
      }

  private:
};

EOSIO_DECLARE_ACTIONS(sum_contract, "eosio"_n, //
                      sum)

}