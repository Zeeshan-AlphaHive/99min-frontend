"use client";

import React from 'react';
import { MapPin, Tag, MessageCircle, LucideIcon, MessageSquare } from 'lucide-react';
import TaskDetailCard from './TaskDetailCard';
import { useI18n } from '@/contexts/i18n-context';

interface TaskDetailCardsProps {
  location: string;
  category: string;
  interest: number;
}

interface CardData {
  icon: LucideIcon;
  label: string;
  value: string;
}

const TaskDetailCards: React.FC<TaskDetailCardsProps> = ({ location, category, interest }) => {
  const { tr } = useI18n();
  const cards: CardData[] = [
    {
      icon: MapPin,
      label: tr('Location'),
      value: location,
    },
    {
      icon: Tag,
      label: tr('Category'),
      value: category,
    },
    {
      icon: MessageSquare ,
      label: tr('Responses'),
      value: tr(`${interest} active`),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {cards.map((card, index) => (
        <TaskDetailCard
          key={index}
          icon={card.icon}
          label={card.label}
          value={card.value}
        />
      ))}
    </div>
  );
};

export default TaskDetailCards;

