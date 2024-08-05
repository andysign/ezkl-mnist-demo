'use client'
import { ReactNode as RN } from 'react';

export default function CenteredButtonWrapper({ children }: { children: RN }) {
    return (
        <div className="my-1 flex flex-row gap-0 sm:my-2 md:my-4 lg:my-6">
            <div className="max-sm:hidden sm:hidden md:block p-2 md:w-1/3 lg:block lg:w-5/12">&nbsp;</div>
            <div className="max-sm:block max-sm:w-full sm:w-full p-2 md:w-1/3 lg:w-2/12">
                {children}
            </div>
            <div className="max-sm:hidden sm:hidden md:block p-2 md:w-1/3 lg:block lg:w-5/12">&nbsp;</div>
        </div>
    )
}
