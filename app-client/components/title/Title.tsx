'use client'
import { ReactNode as RN } from 'react'

export default function Title({ children }: { children: RN }) {
    return (
        <div className="align-items-center sm:my-4 lg:my-8">
            <h1 className="font-extrabold text-2xl lg:text-4xl text-white">
                {children}
            </h1>
        </div>
    )
}
