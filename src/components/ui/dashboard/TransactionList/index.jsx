import React from 'react'
import Transaction from './Transaction'

const TransactionList = ({ transcations }) => {
    return (
        <div className='flex flex-col gap-5'>
            {
                transcations.map(tx => (
                    <Transaction key={tx.id} txData={tx} />
                ))
            }
        </div>
    )
}

export default TransactionList