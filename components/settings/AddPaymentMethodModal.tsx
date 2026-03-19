"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui';
import Input from '@/components/ui/Input';
import { useI18n } from '@/contexts/i18n-context';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (cardData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  }) => void;
}

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { tr } = useI18n();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  const resetForm = () => {
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted.slice(0, 19));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.length >= 2
      ? value.slice(0, 2) + '/' + value.slice(2, 4)
      : value;
    setExpiryDate(formatted.slice(0, 5));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) return;
    onSubmit?.({
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryDate,
      cvv,
      cardholderName,
    });
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div ref={modalRef} className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-textBlack">{tr('Add Card')}</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-50 rounded-lg transition-colors" aria-label={tr('Close')}>
            <X className="w-5 h-5 text-textBlack" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <Input label="Card Number" type="text" value={cardNumber} onChange={handleCardNumberChange} placeholder="1234 5678 9012 3456" required maxLength={19} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Expiry Date" type="text" value={expiryDate} onChange={handleExpiryDateChange} placeholder="MM/YY" required maxLength={5} />
            <Input label="CVV" type="text" value={cvv} onChange={handleCvvChange} placeholder="123" required maxLength={4} />
          </div>
          <div className="mb-6">
            <Input label="Cardholder Name" type="text" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} placeholder="John Doe" required />
          </div>
          <Button type="submit" variant="primary" size="lg" fullWidth>{tr('Add Card')}</Button>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentMethodModal;