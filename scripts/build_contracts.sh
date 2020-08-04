rm -rf build

mkdir build

cd build

cmake -DCMAKE_FRAMEWORK_PATH=/home/gitpod/eosio.cdt/build ..

make -j8

sleep 1s
cleos wallet unlock --password $(cat /password) || true
setabi eosio ./build/contracts/boot/boot.abi
setcode eosio ./build/contracts/boot/boot.wasm
sleep 2s
cleos push action eosio boot "[]" -p eosio@active

sleep 1s
cleos set abi eosio ./build/contracts/sum/sum.abi -p eosio@active
cleos set code eosio ./build/contracts/sum/sum.wasm -p eosio@active
