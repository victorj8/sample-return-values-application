mkdir build

cd build

cmake -DCMAKE_FRAMEWORK_PATH=/home/gitpod/eosio.cdt/build ..

make -j8

cleos wallet unlock --password $(cat /password) || true
cleos set abi eosio ./build/contracts/boot/boot.abi -p eosio@active
cleos set code eosio ./build/contracts/boot/boot.wasm -p eosio@active
cleos push action eosio boot "[]" -p eosio@active

cleos set code eosio ./build/contracts/system/system.wasm -p eosio@active
cleos set abi eosio ./build/contracts/system/system.abi -p eosio@active
cleos push action eosio init "[]" -p eosio@active

cleos set abi eosio ./build/contracts/action_results/action_results.abi -p eosio@active
cleos set code eosio ./build/contracts/action_results/action_results.wasm -p eosio@active
