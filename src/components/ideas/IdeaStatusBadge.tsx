import React from 'react';
import { ProjectIdeaStatus } from '../../types/projectIdea.types';
import { ATCStatusBadge } from '../visual/ATCStatusBadge';

interface IdeaStatusBadgeProps {
  status: ProjectIdeaStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const IdeaStatusBadge: React.FC<IdeaStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  return (
    <ATCStatusBadge
      status={status}
      size={size}
      showIcon={showIcon}
    />
  );
};

