import React from 'react';
import RoleCard from './RoleCard';
import type { RoleCard as RoleCardType } from './types';

type RoleCardsSectionProps = {
  cards: RoleCardType[];
};

export default function RoleCardsSection({ cards }: RoleCardsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <RoleCard key={card.id} card={card} />
      ))}
    </div>
  );
}
