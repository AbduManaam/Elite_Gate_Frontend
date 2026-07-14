import React from 'react';
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-lg select-none">
      <div className="bg-white border border-outline-variant rounded-2xl shadow-xl p-xl max-w-md flex flex-col items-center gap-md">
        <div className="w-16 h-16 rounded-full bg-red-50 text-error flex items-center justify-center border border-red-200">
          <span className="material-symbols-outlined text-[36px]">gpp_bad</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-on-surface">Access Denied (403)</h2>
          <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
            You do not have the required permissions or system privileges to view this page. If you believe this is in error, please contact your system administrator.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-sm px-6 py-2.5 bg-[#113346] hover:bg-[#123749] text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          Return to Welcome Dashboard
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
