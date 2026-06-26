import { useState } from "react";
import { Form, message } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { mockBankQuestions } from "../services/mockData";

export const useCreateExam = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [examConfig, setExamConfig] = useState<any>({
    skill: "Grammar",
    type: "partial",
    part: "Part 1",
  });

  const watchedSkill = Form.useWatch("skill", form) || examConfig.skill;
  const watchedPart = Form.useWatch("part", form) || examConfig.part;
  const watchedVocabTask =
    Form.useWatch("vocabTask", form) || examConfig.vocabTask;

  const filteredQuestions = mockBankQuestions.filter((q) => {
    const skill = watchedSkill;
    const part = watchedPart;
    const task = watchedVocabTask;

    const matchSkill = q.type === (skill || "Grammar");
    const matchPart = q.part === (part || "Part 1");
    const matchTask =
      skill === "Grammar" && part === "Part 2"
        ? q.task === (task || "Task 1")
        : true;
    return matchSkill && matchPart && matchTask;
  });

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        const values = await form.validateFields([
          "name",
          "type",
          "skill",
          "part",
          "duration",
        ]);
        setExamConfig(values);
      }
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      message.error("Vui lòng điền đủ các thông tin bắt buộc!");
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleAddQuestion = (record: any) => {
    if (!record) return;
    if (selectedQuestions.some((q) => q?.key === record?.key)) {
      message.warning("Câu hỏi này đã được chọn!");
      return;
    }

    // Slot replacement logic for parts that only allow single task
    const isSingleSlotPart = (skill: string, part: string) => {
      if (skill === "Speaking") return true;
      if (skill === "Writing") return true;
      if (skill === "Reading" && part !== "Part 2") return true;
      if (skill === "Listening" && part !== "Part 1") return true;
      return false;
    };

    let newSelected = [...selectedQuestions];

    if (record.type === "Vocabulary") {
      // Replace by task
      newSelected = newSelected.filter(
        (q) => !(q?.type === "Vocabulary" && q?.task === record.task),
      );
    } else if (isSingleSlotPart(record.type, record.part)) {
      // Replace by part
      newSelected = newSelected.filter(
        (q) => !(q?.type === record.type && q?.part === record.part),
      );
    }

    setSelectedQuestions([...newSelected, record]);
  };

  const handleRemoveQuestion = (key: string) => {
    setSelectedQuestions(selectedQuestions.filter((q) => q?.key !== key));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newQuestions = [...selectedQuestions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index - 1];
    newQuestions[index - 1] = temp;
    setSelectedQuestions(newQuestions);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedQuestions.length - 1) return;
    const newQuestions = [...selectedQuestions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index + 1];
    newQuestions[index + 1] = temp;
    setSelectedQuestions(newQuestions);
  };

  const handleAddRandom = (count: number) => {
    const available = mockBankQuestions.filter(
      (bq) => !selectedQuestions.some((sq) => sq?.key === bq?.key),
    );
    if (available.length === 0) {
      message.info("Không còn câu hỏi ngẫu nhiên trong ngân hàng!");
      return;
    }
    const shuffle = [...available].sort(() => 0.5 - Math.random());
    const slice = shuffle.slice(0, Math.min(count, shuffle.length));
    setSelectedQuestions([...selectedQuestions, ...slice]);
    message.success(`Đã thêm ${slice.length} câu hỏi ngẫu nhiên!`);
  };

  const handlePublish = () => {
    message.success("Đã xuất bản bộ đề thi thành công!");
    navigate({ to: "/admin/exams" });
  };

  return {
    navigate,
    form,
    currentStep,
    setCurrentStep,
    selectedQuestions,
    setSelectedQuestions,
    filteredQuestions,
    examConfig,
    handleNext,

    handleBack,
    handleAddQuestion,
    handleRemoveQuestion,
    handleMoveUp,
    handleMoveDown,
    handleAddRandom,
    handlePublish,
  };
};
