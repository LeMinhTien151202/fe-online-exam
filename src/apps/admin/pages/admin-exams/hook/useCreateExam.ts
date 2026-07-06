import { useState } from "react";
import { Form, message } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { examApi } from "../services/examApi";
import { EXAMS_KEY, useExamQuestionBank } from "../services/examQuery";
import {
  FE_SKILL_TO_ID,
  IBankQuestion,
  ICreateExamPayload,
  UI_TYPE_TO_API,
  ExamUiType,
} from "../services/types";

const partNumberOf = (part: string) => Number((part || "Part 1").replace(/\D/g, "")) || 1;

export const useCreateExam = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<IBankQuestion[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [examConfig, setExamConfig] = useState<Record<string, unknown>>({
    skill: "Grammar",
    type: "partial",
    part: "Part 1",
  });

  const { bankQuestions, isLoading: isBankLoading } = useExamQuestionBank();

  const watchedSkill = (Form.useWatch("skill", form) as string) || (examConfig.skill as string);
  const watchedPart = (Form.useWatch("part", form) as string) || (examConfig.part as string);
  const watchedVocabTask = (Form.useWatch("vocabTask", form) as string) || (examConfig.vocabTask as string);

  const filteredQuestions = bankQuestions.filter((q) => {
    const matchSkill = q.type === (watchedSkill || "Grammar");
    const matchPart = q.part === (watchedPart || "Part 1");
    const matchTask =
      watchedSkill === "Grammar" && watchedPart === "Part 2"
        ? q.task === (watchedVocabTask || "Task 1")
        : true;
    return matchSkill && matchPart && matchTask;
  });

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        const values = await form.validateFields(["name", "type", "skill", "part", "duration"]);
        setExamConfig(values);
      }
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      message.error("Vui lòng điền đủ các thông tin bắt buộc!");
    }
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleAddQuestion = (record: IBankQuestion) => {
    if (!record) return;
    if (selectedQuestions.some((q) => q?.key === record?.key)) {
      message.warning("Câu hỏi này đã được chọn!");
      return;
    }

    const currentType = (form.getFieldValue("type") as string) || (examConfig.type as string);

    const isSingleSlotPart = (skill: string, part: string) => {
      if (skill === "Speaking" || skill === "Writing") return true;
      if (skill === "Reading" && part !== "Part 2") return true;
      if (skill === "Listening" && part !== "Part 1") return true;
      return false;
    };

    let newSelected = [...selectedQuestions];
    // Luyện theo phần (partial): cho phép thêm rất nhiều câu (tất cả câu của phần) -> không giới hạn 1 slot
    if (currentType !== "partial") {
      if (record.type === "Vocabulary") {
        newSelected = newSelected.filter((q) => !(q?.type === "Vocabulary" && q?.task === record.task));
      } else if (isSingleSlotPart(record.type, record.part)) {
        newSelected = newSelected.filter((q) => !(q?.type === record.type && q?.part === record.part));
      }
    }
    setSelectedQuestions([...newSelected, record]);
  };

  const handleAddAll = (questions: IBankQuestion[]) => {
    const toAdd = questions.filter((q) => !selectedQuestions.some((s) => s?.key === q.key));
    if (toAdd.length === 0) {
      message.info("Đã thêm hết câu hỏi của phần này.");
      return;
    }
    setSelectedQuestions([...selectedQuestions, ...toAdd]);
    message.success(`Đã thêm ${toAdd.length} câu hỏi.`);
  };

  const handleRemoveQuestion = (key: string) => {
    setSelectedQuestions(selectedQuestions.filter((q) => q?.key !== key));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...selectedQuestions];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setSelectedQuestions(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedQuestions.length - 1) return;
    const next = [...selectedQuestions];
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    setSelectedQuestions(next);
  };

  const handleAddRandom = (count: number) => {
    const available = bankQuestions.filter((bq) => !selectedQuestions.some((sq) => sq?.key === bq?.key));
    if (available.length === 0) {
      message.info("Không còn câu hỏi ngẫu nhiên trong ngân hàng!");
      return;
    }
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const slice = shuffled.slice(0, Math.min(count, shuffled.length));
    setSelectedQuestions([...selectedQuestions, ...slice]);
    message.success(`Đã thêm ${slice.length} câu hỏi ngẫu nhiên!`);
  };

  // Publish: POST /exam-sets -> gán câu hỏi từng part -> toggle-active
  const handlePublish = async () => {
    if (selectedQuestions.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 câu hỏi cho đề.");
      return;
    }

    const values = form.getFieldsValue(true);
    const uiType = (values.type || "partial") as ExamUiType;
    const skill = (values.skill || "Grammar") as string;
    const part = (values.part || "Part 1") as string;

    const payload: ICreateExamPayload = {
      title: values.name || `Luyện ${skill} ${uiType === "partial" ? part : ""}`.trim(),
      description: values.description,
      type: UI_TYPE_TO_API[uiType],
    };
    if (uiType === "partial") {
      payload.skillId = FE_SKILL_TO_ID[skill];
      payload.partNumber = partNumberOf(part);
    } else if (uiType === "set") {
      payload.skillId = FE_SKILL_TO_ID[skill];
    }

    try {
      setIsPublishing(true);

      // 1. Tạo đề -> BE trả full tree
      const exam = await examApi.create(payload);

      // 2. Lập bản đồ (skillId-partNumber) -> partId
      const partIdMap = new Map<string, number>();
      (exam.sections ?? []).forEach((section) => {
        (section.parts ?? []).forEach((p) => {
          partIdMap.set(`${section.skillId}-${p.partNumber}`, p.id);
        });
      });

      // 3. Gom câu hỏi đã chọn theo part rồi gán
      const groups = new Map<string, { questionId: number; orderIndex: number }[]>();
      selectedQuestions.forEach((q) => {
        const mapKey = `${q.skillId}-${q.partNumber}`;
        const list = groups.get(mapKey) ?? [];
        list.push({ questionId: q.id, orderIndex: list.length });
        groups.set(mapKey, list);
      });

      let assignedCount = 0;
      for (const [mapKey, questions] of groups) {
        const partId = partIdMap.get(mapKey);
        if (!partId) continue; // câu không khớp part nào trong đề -> bỏ qua
        await examApi.assignQuestions(partId, questions);
        assignedCount += questions.length;
      }

      // 4. Công khai đề
      await examApi.toggleActive(exam.id);

      queryClient.invalidateQueries({ queryKey: EXAMS_KEY });
      message.success(`Đã tạo & xuất bản đề (gán ${assignedCount} câu hỏi).`);
      navigate({ to: "/admin/exams" });
    } catch (err) {
      console.error("Publish exam failed:", err);
      // axios interceptor đã hiện notification lỗi
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    navigate,
    form,
    currentStep,
    setCurrentStep,
    selectedQuestions,
    setSelectedQuestions,
    filteredQuestions,
    bankQuestions,
    isBankLoading,
    isPublishing,
    examConfig,
    handleNext,
    handleBack,
    handleAddQuestion,
    handleAddAll,
    handleRemoveQuestion,
    handleMoveUp,
    handleMoveDown,
    handleAddRandom,
    handlePublish,
  };
};
