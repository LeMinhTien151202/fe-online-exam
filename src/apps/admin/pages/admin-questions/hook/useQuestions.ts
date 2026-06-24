import { useState, useEffect } from "react";
import { Form, message } from "antd";
import { useParams, useNavigate } from "@tanstack/react-router";
import { initialQuestions } from "../services/mockData";

export const useQuestions = () => {
  const { skillId = "grammar" } = useParams({ strict: false }) as any;
  const navigate = useNavigate();
  const [partTab, setPartTab] = useState("part1");
  const [questions, setQuestions] = useState(initialQuestions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const [form] = Form.useForm();

  // Reset partTab when skillId changes
  useEffect(() => {
    setPartTab(skillId.toLowerCase().includes("grammar") ? "grammar" : "part1");
  }, [skillId]);

  const handleCreateQuestion = () => {
    form.resetFields();

    // Determine initial items based on current part
    const initialValues: any = { part: partTab };
    // Determined by skill
    const skillLower = skillId.toLowerCase();

    if (skillLower === "listening") {
      if (partTab === "part1" || partTab === "part4") {
        initialValues.questions = [{}];
        if (partTab === "part4") initialValues.questions = [{}, {}, {}, {}];
      } else if (partTab === "part3") {
        initialValues.opinions = [{}, {}, {}, {}];
      } else if (partTab === "part2") {
        initialValues.opinionPool = [{}, {}, {}, {}, {}, {}];
        initialValues.speakerAnswers = [null, null, null, null];
      }
    } else if (skillLower === "reading") {
      if (partTab === "part1") initialValues.gaps = Array(5).fill({});
      else if (partTab === "part2")
        initialValues.sets = [
          {
            sentences: Array(6)
              .fill({})
              .map((_, i) => ({ id: i })),
          },
          {
            sentences: Array(6)
              .fill({})
              .map((_, i) => ({ id: i })),
          },
        ];
      else if (partTab === "part3") {
        initialValues.people = Array(4).fill({});
        initialValues.questions = Array(7).fill({});
      } else if (partTab === "part4") {
        initialValues.paragraphs = Array(7).fill({});
        initialValues.headings = Array(8).fill({});
      }
    } else if (skillLower === "writing") {
      if (partTab === "part1") initialValues.p1Questions = Array(5).fill("");
      else if (partTab === "part3") {
        initialValues.p3MemberQuestions = [
          { member: "Member A", question: "" },
          { member: "Member B", question: "" },
          { member: "Member C", question: "" },
        ];
      }
    } else if (skillLower === "speaking") {
      if (partTab === "part1") initialValues.p1Questions = Array(3).fill("");
      else if (partTab === "part4") {
        // Preparation warning logic is handled in UI
      }
    } else {
      // Grammar or Vocabulary
      if (partTab === "grammar" || skillLower.includes("grammar")) {
        initialValues.gramQuestions = Array(25).fill({
          optA: "",
          optB: "",
          optC: "",
          answer: "A",
        });
      } else if (partTab.startsWith("vocab")) {
        initialValues.vocabPool = Array(10).fill("");
        initialValues.vocabQuestions = Array(5).fill({
          question: "",
          answerIndex: null,
        });
      }
      initialValues.difficulty = "medium";
      initialValues.status = "active";
    }

    form.setFieldsValue(initialValues);
    setSelectedQuestion(null);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = () => {
    const values = form.getFieldsValue();
    const newQuestion = {
      key: String(questions.length + 1),
      content: values.content || "Nội dung câu hỏi mẫu...",
      type: skillId,
      part: values.part || partTab,
      difficulty: values.difficulty || "medium",
      tags: values.tags || ["General"],
      useCount: 0,
      successRate: 100,
      status: values.status || "active",
      updatedAt: "03/06/2026",
    };
    setQuestions([newQuestion, ...questions]);
    setIsModalOpen(false);
    message.success("Đã lưu câu hỏi thành công!");
  };

  return {
    skillTab: skillId,
    setSkillTab: (val: string) =>
      navigate({ to: `/admin/questions/${val}` as any }),
    partTab,
    setPartTab,
    questions,
    isModalOpen,
    setIsModalOpen,
    selectedQuestion,
    setSelectedQuestion,
    form,
    handleCreateQuestion,
    handleSaveQuestion,
    navigate,
  };
};
