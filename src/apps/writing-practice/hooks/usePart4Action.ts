import {
  useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '../../../configs/toast';
import { countWords } from '../utils/wordCounter';

export const usePart4Action = (
  informalEmail: string,
  setInformalEmail: React.Dispatch<React.SetStateAction<string>>,
  formalEmail: string,
  setFormalEmail: React.Dispatch<React.SetStateAction<string>>
) => {
  const navigate = useNavigate();
  const [showSampleModal, setShowSampleModal] = useState(false);

  const handleInformalChange = (value: string) => {
    setInformalEmail(value);
  };

  const handleFormalChange = (value: string) => {
    setFormalEmail(value);
  };

  const handleSubmit = () => {
    const infWc = countWords(informalEmail);
    const formWc = countWords(formalEmail);

    if (!informalEmail.trim() || !formalEmail.trim()) {
      toast.warning("Vui lòng hoàn thành cả 2 email!");
      return;
    }

    if (infWc < 40 || infWc > 60) {
      toast.error(`Email thân mật (${infWc} từ) chưa đúng giới hạn khoảng 50 từ (40-60 từ)!`);
      return;
    }

    if (formWc < 120 || formWc > 150) {
      toast.error(`Email trang trọng (${formWc} từ) chưa đúng giới hạn 120-150 từ!`);
      return;
    }

    toast.success("Xin chúc mừng! Bạn đã hoàn thành xuất sắc toàn bộ bài thi viết (Writing Practice)!");
    navigate({ to: '/writing' });
  };

  const handleBack = () => {
    navigate({ to: '/writing/part/3' });
  };

  return {
    showSampleModal,
    setShowSampleModal,
    handleInformalChange,
    handleFormalChange,
    handleSubmit,
    handleBack
  };
};
