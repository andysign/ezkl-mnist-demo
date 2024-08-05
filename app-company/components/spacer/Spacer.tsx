'use client'

export default function Spacer() {
    return (
        <div className="flex flex-no-wrap items-center py-4">
            <div className="bg-gray-500 flex-grow h-px max-w-full" />
            <h2 className="px-10 pt-2 pb-8 w-auto font-semibold text-white text-l uppercase">\/</h2>
            <div className="bg-gray-500 flex-grow h-px max-w-full" />
        </div>
    )
}
