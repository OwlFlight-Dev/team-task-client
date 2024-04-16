import { Chip } from '@mui/material';
import React, { useEffect, useState } from 'react';

export type StatusTypes = 'new' | 'in-progress' | 'completed';

interface StatusMappingProps {
  status: string;
}

const StatusMapping: React.FC<StatusMappingProps> = ({ status }) => {
  const [ chipColor, setChipColor ] = useState<'secondary' | 'warning' | 'success'>();

  useEffect(() => {
    const lowercaseStatus = status.toLowerCase();
    switch (lowercaseStatus) {
      case 'new':
        setChipColor('secondary'); // Reset chip color
        break;
      case 'in-progress':
        setChipColor('warning'); // Reset chip color
        break;
      case 'completed':
        setChipColor('success');
        break;
      default:
        setChipColor('secondary'); // Reset chip color
        break;
    }
  }, [status]);

  const mapStatus = (status: string) => {
    if (!status) return ''; // If status is undefined or null, return an empty string
    const lowercaseStatus = status.toLowerCase();
    switch (lowercaseStatus) {
      case 'new':
        return 'NEW';
      case 'in-progress':
        return 'IN PROGRESS';
      case 'completed':
        return 'COMPLETED';
      default:
        return status.toUpperCase(); // If status is not mapped, return it in uppercase
    }
  };

  return (
    <Chip color={chipColor} label={mapStatus(status)}/>
    
  );
}

export default StatusMapping;