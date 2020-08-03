// To see this in action, run this in a terminal:
//      gp preview $(gp url 8000)

import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

import './styles.css';

const rpc = new JsonRpc(''); // nodeos and web server are on same port
const privateKey = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';

const App: React.FC = () => {
    const [api, setApi] = useState<Api>();
    const [numbers, setNumbers] = useState<{ first: number|'', second: number|'' }>({ first: 0, second: 0})
    const [error, setError] = useState<string>('');
    const [result, setResult] = useState<number|undefined>();

    useEffect(() => {
        setApi(new Api({ rpc, signatureProvider: new JsSignatureProvider([privateKey]) }));
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
            const result = await api.transact(
                {
                    actions: [{
                        account: 'eosio',
                        name: 'sum',
                        authorization: [{
                            actor: 'bob',
                            permission: 'active',
                        }],
                        data: {
                            numberA: numbers.first,
                            numberB: numbers.second
                        },
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
            console.log(result);
            setResult(result.processed.action_traces[0].return_value);
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
