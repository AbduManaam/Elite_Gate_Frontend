import React from 'react';
import { MOCK_BANNER_CONTENT } from '../../../shared/mocks/bannerMock';

export interface FeaturedBannerProps {
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
}

export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({
  title = MOCK_BANNER_CONTENT.title,
  description = MOCK_BANNER_CONTENT.description,
  className = ''
}) => {
  return (
    <div className={`mb-xl ${className}`}>
      <h2 className="font-display-lg text-display-lg text-on-surface mb-2">
        {title}
      </h2>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
        {description}
      </p>
    </div>
  );
};

export default FeaturedBanner;
