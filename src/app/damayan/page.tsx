'use client';

import React from 'react';
import DamayanDashboard from '@/components/damayan/DamayanDashboard';
import { withAuth } from '@/utils/withAuth';

const DamayanPage = () => {
  return <DamayanDashboard />;
};

export default withAuth(DamayanPage);
