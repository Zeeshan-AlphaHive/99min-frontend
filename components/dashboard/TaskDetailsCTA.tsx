"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { useI18n } from '@/contexts/i18n-context';

const TaskDetailsCTA: React.FC = () => {
  const { tr } = useI18n();
  return (
    <div className="bg-white p-4 z-30">
        <div className="max-w-7xl mx-auto">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          {tr("I can help!")}
        </Button>
      </div>
    </div>
  );
};

export default TaskDetailsCTA;

