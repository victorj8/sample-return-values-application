// To see this in action, run this in a terminal:
//      gp preview $(gp url 8000)

import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { Api, JsonRpc, WasmAbi } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { WasmAbiProvider } from 'eosjs/dist/eosjs-wasmabi';

import './styles.css';

import SumAction from './SumAction'

const rpc = new JsonRpc(''); // nodeos and web server are on same port
const privateKey = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';

const App: React.FC = () => {
    const [api, setApi] = useState<Api>();

    useEffect(() => {
        (async () => {
            const api = new Api({ rpc, signatureProvider: new JsSignatureProvider([privateKey]), wasmAbiProvider: new WasmAbiProvider }); 
            const response = await fetch('./src/action_results_abi.wasm');
            const buffer = await response.arrayBuffer();
            const actionResultsModule = await WebAssembly.compile(buffer);

            await api.wasmAbiProvider.setWasmAbis([new WasmAbi({
                account: 'returnvalue',
                mod: actionResultsModule,
                memoryThreshold: 32000,
                textEncoder: new TextEncoder(),
                textDecoder: new TextDecoder('utf-8', { fatal: true }),
                print: (x: any) => console.info(x),
            })]);

            setApi(api);
        })();
    }, []);

    return (
        <div className='container'>
            <div className='header'>Sample Return Values Application</div>
            <SumAction api={api}/>
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('sample')
);
