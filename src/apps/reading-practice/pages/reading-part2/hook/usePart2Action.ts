import { useState, useEffect } from 'react';
import { message } from 'antd';
import { ISentence, initialSentences, correctOrder } from '../services/data';

export const usePart2Action = () => {
  const [timeLeft, setTimeLeft] = useState(1077); // 17:57 -> 1077 seconds
  const [version, setVersion] = useState('v3');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pool, setPool] = useState<ISentence[]>(initialSentences);
  const [slots, setSlots] = useState<Record<number, ISentence | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null
  });

  const [draggedItem, setDraggedItem] = useState<ISentence | null>(null);
  const [draggedFromSlot, setDraggedFromSlot] = useState<number | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (item: ISentence, fromSlot: number | null = null) => {
    if (isSubmitted) return;
    setDraggedItem(item);
    setDraggedFromSlot(fromSlot);
  };

  const handleDragOver = (e: React.DragEvent, slotId: number) => {
    e.preventDefault();
    if (isSubmitted) return;
    setDragOverSlot(slotId);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (slotId: number) => {
    if (isSubmitted || !draggedItem) return;

    setSlots(prev => {
      const nextSlots = { ...prev };
      const currentInSlot = nextSlots[slotId];
      if (currentInSlot) {
        setPool(prevPool => [...prevPool, currentInSlot]);
      }

      if (draggedFromSlot !== null) {
        nextSlots[draggedFromSlot] = null;
      } else {
        setPool(prevPool => prevPool.filter(item => item.id !== draggedItem.id));
      }

      nextSlots[slotId] = draggedItem;
      return nextSlots;
    });

    setDraggedItem(null);
    setDraggedFromSlot(null);
    setDragOverSlot(null);
  };

  const handleRemoveFromSlot = (slotId: number, item: ISentence) => {
    if (isSubmitted) return;
    setSlots(prev => ({
      ...prev,
      [slotId]: null
    }));
    setPool(prevPool => [...prevPool, item]);
  };

  const handleAutoPlace = (item: ISentence) => {
    if (isSubmitted) return;
    const firstEmptySlot = Object.keys(slots).find(key => !slots[Number(key)]);
    if (firstEmptySlot) {
      const slotNum = Number(firstEmptySlot);
      setSlots(prev => ({
        ...prev,
        [slotNum]: item
      }));
      setPool(prevPool => prevPool.filter(p => p.id !== item.id));
    } else {
      message.warning('Tất cả các ô trống đã đầy! Hãy kéo bớt item ra.');
    }
  };

  const handleSubmit = () => {
    const filledCount = Object.values(slots).filter(s => s !== null).length;
    if (filledCount < 5) {
      message.warning(`Vui lòng hoàn thành sắp xếp tất cả 5 ô trống! (Hiện tại: ${filledCount}/5)`);
      return;
    }

    setIsSubmitted(true);
    const correctCount = Object.keys(slots).filter(key => {
      const idx = Number(key);
      const slotItem = slots[idx];
      return slotItem && slotItem.id === correctOrder[idx - 1];
    }).length;

    // Save progress to local storage
    const progressPercent = Math.round((correctCount / 5) * 100);
    const savedProgress = localStorage.getItem('aptis_reading_progress');
    let nextProgress = { r2: progressPercent };
    if (savedProgress) {
      try {
        nextProgress = { ...JSON.parse(savedProgress), r2: progressPercent };
      } catch (e) {}
    }
    localStorage.setItem('aptis_reading_progress', JSON.stringify(nextProgress));

    message.success(`Chúc mừng! Bạn đã hoàn thành Part 2. Kết quả: ${correctCount}/5 câu đúng.`);
  };

  const handleRetry = () => {
    setSlots({ 1: null, 2: null, 3: null, 4: null, 5: null });
    setPool(initialSentences);
    setIsSubmitted(false);
    setTimeLeft(1077);
  };

  const placedCount = Object.values(slots).filter(Boolean).length;
  const progressPercent = Math.round((placedCount / 5) * 100);
  const correctCount = Object.keys(slots).filter(key => {
    const idx = Number(key);
    const slotItem = slots[idx];
    return slotItem && slotItem.id === correctOrder[idx - 1];
  }).length;

  return {
    timeLeft,
    version,
    setVersion,
    isSubmitted,
    pool,
    slots,
    dragOverSlot,
    formatTime,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFromSlot,
    handleAutoPlace,
    handleSubmit,
    handleRetry,
    placedCount,
    progressPercent,
    correctCount
  };
};
