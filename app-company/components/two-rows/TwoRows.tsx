'use client'
import { ReactNode as RN } from'react';

export default function TwoRows({ top, bottom }: { top: RN; bottom: RN }) {
    return (
        <div className="container mx-auto p-2 md:p-4 lg:p-6">
            <div className="row mb-4 md:mb-6 lg:mb-8 p-4 md:p-6 lg:p-8">
                <h2 className="text-l text-white md:text-xl lg:text-2xl font-bold">FileName</h2>
                <div className="text-sm text-white md:text-lg lg:text-lg">
                    <pre className="blackspace-pre-wrap">{top}</pre>
                </div>
            </div>
            <div className="row p-4 md:p-6 lg:p-8">
                <h2 className="text-l text-white md:text-xl lg:text-2xl font-bold">Size</h2>
                <div className="text-sm text-white md:text-lg lg:text-lg">
                    <pre className="blackspace-pre-wrap">{bottom}</pre>
                </div>
            </div>
        </div>
    )
}
