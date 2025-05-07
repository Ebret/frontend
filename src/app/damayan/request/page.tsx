'use client';

import React from 'react';
import DamayanAssistanceForm from '@/components/damayan/DamayanAssistanceForm';
import { withAuth } from '@/utils/withAuth';

const RequestAssistancePage = () => {
  return <DamayanAssistanceForm />;
};

export default withAuth(RequestAssistancePage);
