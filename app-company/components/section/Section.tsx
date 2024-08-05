'use client'
import { ReactNode as RN } from 'react';

export default function Section({ children }: { children: RN }) {
    return (
        <div className="sm:mt-4 lg:mt-8 mx-auto">
            {children}
        </div>
    )
}
