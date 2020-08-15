#!/bin/bash
sed -i'.bak' 's/vector<char>/bytes/g' system.abi
