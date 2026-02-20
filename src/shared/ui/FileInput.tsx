import { forwardRef } from 'react'

function Component(
    props: React.InputHTMLAttributes<HTMLInputElement>,
    ref: React.Ref<HTMLInputElement>
) {
    return (
        <input
            ref={ref}
            type='file'
            tabIndex={-1}
            className='hidden'
            accept='video/mp4,video/x-m4v,video/*,image/*'
            {...props}
        />
    )
}

export const FileInput = forwardRef(Component)
