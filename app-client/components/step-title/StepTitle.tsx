'use client'
import { ReactNode as RN } from 'react'

export default function StepTitle({ children }: { children: RN }) {
    return (
        <div className="align-items-center sm:my-4 lg:my-8">
            <h2 className="font-semibold text-slate-400">{children}</h2>
        </div>
    )
}
