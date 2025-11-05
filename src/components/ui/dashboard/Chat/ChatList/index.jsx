import React from 'react'
import ChatPreview from './ChatPreview'

const ChatList = () => {
    return (
        <div className='flex flex-col gap-3 mt-[22px] h-[400px] overflow-y-auto hide-scrollbar'>

            <ChatPreview />
            <ChatPreview />
            <ChatPreview />
            <ChatPreview />
            <ChatPreview />
            <ChatPreview />
            <ChatPreview />
            <ChatPreview />
            <ChatPreview />
            <ChatPreview />

        </div>
    )
}

export default ChatList