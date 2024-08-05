'use client'
import { ReactNode as RN } from 'react'

export default function ThreeColumns({ left, center, right }: { left: RN; center: RN; right: RN }) {
    return (
        <div className="flex flex-wrap gap-0 lg:gap-6">
            <div className="w-full p-2 md:w-5/12 lg:w-[calc(5/12*100%-1rem)]">
                {left}
            </div>
            <div className="w-full p-2 md:w-2/12 lg:w-[calc(2/12*100%-1rem)]">
                {center}
            </div>
            <div className="w-full p-2 md:w-5/12 lg:w-[calc(5/12*100%-1rem)]">
                {right}
            </div>
        </div>
    );
}
