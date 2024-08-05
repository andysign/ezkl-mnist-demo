'use client'
import { ReactNode as RN } from 'react';

export default function SubTitle({ children }: { children: RN }) {
    return (
        <div className="align-items-center sm:my-4 lg:my-8">
            <h1 className="font-semibold text-white text-xl lg:text-2xl">{children}</h1>
        </div>
    )
}
