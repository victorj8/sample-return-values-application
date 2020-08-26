import React, { useState } from 'react';
import { Api } from 'eosjs';
import { TransactionBuilder } from 'eosjs/dist/eosjs-api';

import Error from '../Error';

interface SumActionProps {
    api: Api | undefined;
}

const SumAction: React.FC<SumActionProps> = ({ api }: SumActionProps) => {
    const [numbers, setNumbers] = useState<{ first: number|'', second: number|'' }>({ first: 0, second: 0})
    const [error, setError] = useState<string>('');
    const [result, setResult] = useState<number|undefined>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return setNumbers({...numbers, [e.target.name]: '' });
        setNumbers({...numbers, [e.target.name]: Number.parseInt(e.target.value) });
    };

    const sum = async () => {
        setError('');
        if (api === undefined) {
            return setError('Unexpected error: Api object is not set.')
        }
        try {
            const tx = api.buildTransaction() as TransactionBuilder;
            tx.with('returnvalue').as('returnvalue').sum(numbers.first, numbers.second);
            // two changes needed, "as TransactResult" for return type in transact and add new return_value_* variables to action trace type
            const transactionResult = await tx.send({ blocksBehind: 3, expireSeconds: 30 }) as any;
            setResult(transactionResult.processed.action_traces[0].return_value_data);
        } catch (e) {
            if (e.json) {
                setError(JSON.stringify(e.json, null, 4));
            } else {
                setError(e + '');
            }
        }
    };

    const retry = () => {
        setResult(undefined);
    };

    return (
        <div className='contract-container'>
            <div className='contract-header-container'>
                <div className='contract-header'>Addition</div>
                {!result && <button className='button' onClick={e => sum()}>Get Result</button>}
                {result && <button className='button' onClick={e => retry()}>Retry</button>}
            </div>
            <div className='equation'>
                <div className='input-container'>
                    <input
                        className='input'
                        name='first'
                        type='number'
                        disabled={!!result}
                        value={numbers.first}
                        onChange={handleChange}>
                    </input>
                </div>
                <div className='symbol'>+</div>
                <div className='input-container'>
                    <input
                        className='input'
                        name='second'
                        type='number'
                        disabled={!!result}
                        value={numbers.second}
                        onChange={handleChange}>
                    </input>
                </div>
                <div className='symbol'>=</div>
                {!result && <div className='result'>?</div>}
                {result && <div className='result'>{result}</div>}
            </div>
            
            {error && <Error error={error} />}
        </div>
    );
};

export default SumAction;