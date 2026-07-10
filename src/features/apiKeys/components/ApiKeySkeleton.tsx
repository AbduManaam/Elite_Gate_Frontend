import React from 'react';

export const ApiKeySkeleton: React.FC = () => {
    return (
        <div className="w-full flex flex-col gap-md animate-pulse text-left">
            <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="h-12 border-b border-outline-variant bg-surface-container-low flex items-center px-md gap-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/12"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/12"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/12"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/12"></div>
                </div>
                <div className="divide-y divide-outline-variant">
                    {[...Array(5)].map((_, idx) => (
                        <div key={idx} className="h-16 flex items-center px-md gap-4 bg-white">
                            <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/12"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/6"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/12"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/12"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/12"></div>
                            <div className="h-4 bg-gray-100 rounded w-8 ml-auto"></div>
                        </div>
                    ))}
                </div>
                <div className="h-12 border-t border-outline-variant px-md bg-white flex items-center justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/5"></div>
                    <div className="flex gap-2">
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiKeySkeleton;
