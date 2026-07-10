import React from 'react';

interface DocLinkItem {
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  url: string;
}

export const DocumentationCard: React.FC = () => {
  const docs: DocLinkItem[] = [
    {
      title: 'API Reference',
      description: 'Explore all available APIs',
      icon: 'terminal',
      iconBg: 'bg-[#e3f2fd]',
      iconColor: 'text-[#0d47a1]',
      url: '#',
    },
    {
      title: 'Gateway Guide',
      description: 'Learn how to get started',
      icon: 'menu_book',
      iconBg: 'bg-[#eceff1]',
      iconColor: 'text-[#37474f]',
      url: '#',
    },
  ];

  return (
    <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col gap-md shadow-xs text-left h-full">
      <div className="flex items-center gap-xs border-b border-outline-variant pb-xs">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
          import_contacts
        </span>
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          Documentation
        </h3>
      </div>

      <div className="flex flex-col gap-sm">
        {docs.map((doc) => (
          <a
            key={doc.title}
            href={doc.url}
            className="flex items-center justify-between p-sm border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-md min-w-0">
              {/* Icon Circle */}
              <div className={`w-8 h-8 rounded-lg ${doc.iconBg} ${doc.iconColor} flex items-center justify-center shrink-0 shadow-sm`}>
                <span className="material-symbols-outlined text-[16px]">
                  {doc.icon}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                  {doc.title}
                </p>
                <p className="text-[11px] text-on-surface-variant font-medium mt-0.5 truncate">
                  {doc.description}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[16px] transition-colors">
              chevron_right
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default DocumentationCard;
