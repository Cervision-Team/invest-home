import React from 'react'
import NotificationPreview from './NotificationPreview'

const NotificationList = () => {
    return (
        <div className='flex flex-col gap-3 mt-[22px] h-[400px] overflow-y-auto hide-scrollbar'>
            <NotificationPreview isRead={false} />
            <NotificationPreview isRead={true} />
            <NotificationPreview isRead={false} />
            <NotificationPreview isRead={true} />
            <NotificationPreview isRead={false} />
            <NotificationPreview isRead={true} />
            <NotificationPreview isRead={false} />
            <NotificationPreview isRead={true} />
            <NotificationPreview isRead={false} />
            <NotificationPreview isRead={true} />
            <NotificationPreview isRead={false} />
            <NotificationPreview isRead={true} />
        </div>
    )
}

export default NotificationList