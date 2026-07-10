import React from 'react';
import { ProfileSettings } from '../../auth';

export const ProjectSettings: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col w-full">
      <ProfileSettings />
    </div>
  );
};

export default ProjectSettings;
