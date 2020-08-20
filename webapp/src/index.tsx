// To see this in action, run this in a terminal:
//      gp preview $(gp url 8000)

import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { Api, JsonRpc, WasmAbi } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { WasmAbiProvider } from 'eosjs/dist/eosjs-wasmabi';

import './styles.css';
import { TransactionBuilder } from 'eosjs/dist/eosjs-api';
import { TransactResult } from 'eosjs/dist/eosjs-api-interfaces';

const rpc = new JsonRpc(''); // nodeos and web server are on same port
const privateKey = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';

const App: React.FC = () => {
    const [api, setApi] = useState<Api>();
    const [numbers, setNumbers] = useState<{ first: number|'', second: number|'' }>({ first: 0, second: 0})
    const [error, setError] = useState<string>('');
    const [result, setResult] = useState<number|undefined>();

    useEffect(() => {
        (async () => {
            const wasmAbiProvider = new WasmAbiProvider();
            const api = new Api({ rpc, signatureProvider: new JsSignatureProvider([privateKey]), wasmAbiProvider }); 
            const response = await fetch('./src/sum_abi.wasm');
            const buffer = await response.arrayBuffer();
            const sumModule = await WebAssembly.compile(buffer);

            wasmAbiProvider.setWasmAbis([new WasmAbi({
                account: 'returnvalue',
                mod: sumModule,
                memoryThreshold: 32000,
                textEncoder: new TextEncoder(),
                textDecoder: new TextDecoder('utf-8', { fatal: true }),
                print: (x: any) => console.info(x),
            })]);

            setApi(api);
        })();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return setNumbers({...numbers, [e.target.name]: '' });
        setNumbers({...numbers, [e.target.name]: Number.parseInt(e.target.value) });
    }

    const sum = async () => {
        setResult(undefined);
        if (api === undefined) {
            return setError('Unexpected error: Api object is not set.')
        }
        try {
            const tx = api.buildTransaction() as TransactionBuilder;
            tx.with('eosio').as('bob').sum(numbers.first, numbers.second);
            const transactionResult = await tx.send({ blocksBehind: 3, expireSeconds: 30 }) as TransactResult;
            console.log(transactionResult);
            setResult(transactionResult.processed.action_traces[0].return_value);
        } catch (e) {
            if (e.json) {
                setError(JSON.stringify(e.json, null, 4));
            } else {
                setError(e + '');
            }
        }
    }

    return (
        <div className='container'>
            <div className='header'>Sample Return Values Application</div>
            <div className='input-container'>
                <div className='label'>First number:</div>
                <div>
                    <input
                        className='input'
                        name='first'
                        type='number'
                        value={numbers.first}
                        onChange={handleChange}>
                    </input>
                </div>
            </div>
            <div className='input-container'>
                <div className='label'>Second number:</div>
                <div>
                    <input
                        className='input'
                        name='second'
                        type='number'
                        value={numbers.second}
                        onChange={handleChange}>
                    </input>
                </div>
            </div>
            <div className='button-container'>
                <button className='button' onClick={e => sum()}>Sum</button>
            </div>
            {result && <div className='result'>Result: {result}</div>}
            {error && <div>
                <br />
                Error:
                <code><pre>{error}</pre></code>
            </div>}
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('sample')
);
