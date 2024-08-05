'use client'
import { ReactNode as RN } from 'react';

export default function TwoColumns({ left, right }: { left: RN; right: RN }) {
    return (
        <div className="flex flex-wrap gap-0 lg:gap-4">
            <div className="w-full p-2 my-2 md:w-1/2 lg:w-[calc(50%-0.5rem)] border border-blue-800">
                {left}
            </div>
            <div className="w-full p-2 my-2 md:w-1/2 lg:w-[calc(50%-0.5rem)] border border-blue-800">
                {right}
            </div>
        </div>
    )
}
