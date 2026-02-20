'use client'

import { forwardRef, useImperativeHandle, useState } from 'react'
import { Container } from '@/shared/ui/box'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { UserAvatar } from '@/shared/ui/user-avatar'
import { cn } from '@/shared/utils/common.utils'
import { MentionNodeAttrs, SuggestionListProps, SuggestionListRef } from '../types'

const SuggestionList = forwardRef<SuggestionListRef, SuggestionListProps>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index: number) => {
        if (index >= props.items.length) {
            return
        }

        const suggestion = props.items[index]

        const mentionItem: MentionNodeAttrs = {
            id: String(suggestion.id),
            name: String(suggestion.name)
        }

        props.command(mentionItem)
    }

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
    }

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                upHandler()
                return true
            }

            if (event.key === 'ArrowDown') {
                downHandler()
                return true
            }

            if (event.key === 'Enter') {
                enterHandler()
                return true
            }

            return false
        }
    }))

    if (!props.items.length) return null

    return (
        <Container
            className='h-full min-w-32 max-w-52 overflow-auto p-1 shadow-md'
            withBottom={false}>
            <ScrollArea type='always'>
                <div className='flex max-h-72 flex-col gap-1'>
                    {props.items.map((user, index) => (
                        <div
                            key={user.id}
                            title={`@${user.name}, id${user.id}`}
                            className={cn(
                                'h-auto cursor-pointer rounded-md px-2 py-1 hover:bg-accent',
                                {
                                    ['bg-accent']: index === selectedIndex
                                }
                            )}
                            onClick={() => selectItem(index)}>
                            <UserAvatar>
                                <UserAvatar.Avatar
                                    size='sm'
                                    avatar={user.avatar}
                                    avatarColor={user.avatarColor}
                                    name={user.name}
                                />
                                <UserAvatar.Details>
                                    <UserAvatar.Name
                                        name={user.name}
                                        className='truncate text-sm sm:text-sm'
                                    />
                                </UserAvatar.Details>
                            </UserAvatar>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Container>
    )
})

SuggestionList.displayName = 'SuggestionList'
export default SuggestionList
