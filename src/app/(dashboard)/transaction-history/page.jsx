"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import doneIcon from "../../../../public/icons/profile/done-icon.svg"
import pendingIcon from "../../../../public/icons/profile/pending-icon.svg"
import dromenuIcon from "../../../../public/icons/profile/dropmenu-icon.svg"
import TransactionList from '@/components/ui/dashboard/TransactionList'
const TransactionHistory = () => {
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
            <h1 className='text-[#1B1F27] text-[30px] font-semibold mb-8'>Ödənişlərim</h1>
            <section className='flex flex-col gap-5'>
                <TransactionList transcations={historyData} />
            </section>
        </main>
    )
}

export default TransactionHistory