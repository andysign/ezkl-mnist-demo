'use client'
import { ReactNode as RN } from 'react';

export default function CenteredSubTitle({ children }: { children: RN }) {
    return <div className="w-full py-3 text-center text-white font-semibold">{children}</div>
}
