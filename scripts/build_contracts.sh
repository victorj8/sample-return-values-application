rm -rf build

mkdir build

cd build

cmake -DCMAKE_FRAMEWORK_PATH=/home/gitpod/eosio.cdt/build ..

make -j8

cleos wallet unlock --password $(cat /password) || true
cleos set abi eosio ./build/contracts/boot/boot.abi -p eosio@active
cleos set code eosio ./build/contracts/boot/boot.wasm -p eosio@active
cleos push action eosio boot "[]" -p eosio@active

cleos set abi eosio ./build/contracts/sum/sum.abi -p eosio@active
cleos set code eosio ./build/contracts/sum/sum.wasm -p eosio@active
