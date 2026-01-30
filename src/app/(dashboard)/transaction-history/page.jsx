"use client"
import React, { useState } from 'react'
import TransactionList from '@/components/ui/dashboard/TransactionList'
import Search from '@/components/ui/dashboard/Search';
import { Button } from '@/components/ui/dashboard/Buttons/ProfileButtons';
const TransactionHistory = () => {
    const [search, setSearch] = useState("");

    const [historyData] = useState([
        {
            id: 1,
            transactionId: "#567841565",
            status: "pending",
            price: 15,
            date: "10/10/2025",
            time: "14:45",

        },
        {
            id: 2,
            transactionId: "#567841565",
            status: "done",
            price: 15,
            date: "10/10/2025",
            time: "14:45",

        },
        {
            id: 3,
            transactionId: "#567841565",
            status: "done",
            price: 15,
            date: "10/10/2025",
            time: "14:45",

        }
    ]);

    return (
        <main className='w-full text-[#1B1F27]'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10'>
                <div className='w-full md:max-w-md'>
                    <Search search={search} setSearch={setSearch} />
                </div>
                <div className='flex gap-3 md:gap-6 md:justify-end'>
                    {/* <Button /> */}
                </div>
            </div>
            <h1 className='text-[#1B1F27] text-[20px] font-semibold mb-8'>Ödənişlərim</h1>
            <section className='flex flex-col gap-5'>
                <TransactionList transcations={historyData} />
            </section>
        </main>
    )
}

export default TransactionHistory
