import { useMemo, useState } from "react";
import { Form, message } from "antd";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  useCreateQuestionsMutation,
  useDeleteQuestionMutation,
  useQuestionsQuery,
} from "../services/questionQuery";
import {
  buildCreatePayloads,
  mapQuestionToRow,
} from "../services/questionMapper";
import { SKILL_ID, SkillRoute } from "../services/types";
import { usePagination } from "@/shared/hooks/usePagination";

const SKILL_ROUTES: SkillRoute[] = [
  "grammar",
  "listening",
  "reading",
  "speaking",
  "writing",
];

const normalizeSkill = (raw: string): SkillRoute => {
  const lower = (raw || "").toLowerCase();
  return SKILL_ROUTES.find((s) => lower.includes(s)) ?? "grammar";
};

// FE partTab -> partNumber API (dùng để lọc danh sách)
const partTabToNumber = (skill: SkillRoute, partTab: string): number => {
  if (skill === "grammar")
    return partTab.includes("vocab") || partTab === "part2" ? 2 : 1;
  if (skill === "reading") {
    if (partTab === "part1") return 1;
    if (partTab === "part2") return 2;
    if (partTab === "part3") return 4;
    return 5; // part4 -> heading match (P5)
  }
  const match = partTab.match(/\d+/);
  return match ? Number(match[0]) : 1;
};

export const useQuestions = () => {
  const { skillId = "grammar" } = useParams({ strict: false }) as {
    skillId?: string;
  };
  const navigate = useNavigate();
  const skill = normalizeSkill(skillId);

  const { page, pageSize, onChange, reset } = usePagination(10);

  const [partTab, setPartTab] = useState(
    skill === "grammar" ? "grammar" : "part1",
  );
  // Reset partTab + trang khi đổi kỹ năng (điều chỉnh state lúc render thay vì useEffect)
  const [trackedSkill, setTrackedSkill] = useState(skill);
  if (skill !== trackedSkill) {
    setTrackedSkill(skill);
    setPartTab(skill === "grammar" ? "grammar" : "part1");
    reset();
  }

  // Đổi part -> về trang 1
  const changePartTab = (p: string) => {
    setPartTab(p);
    reset();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<ReturnType<
    typeof mapQuestionToRow
  > | null>(null);

  const [form] = Form.useForm();

  const createMutation = useCreateQuestionsMutation();
  const deleteMutation = useDeleteQuestionMutation();

  const partNumber = partTabToNumber(skill, partTab);
  const questionsQuery = useQuestionsQuery({
    skillId: SKILL_ID[skill],
    partNumber,
    page,
    limit: pageSize,
  });

  const questions = useMemo(
    () => (questionsQuery.data?.data ?? []).map(mapQuestionToRow),
    [questionsQuery.data],
  );
  const total = questionsQuery.data?.metaData?.total ?? 0;

  const handleCreateQuestion = () => {
    form.resetFields();

    const initialValues: Record<string, unknown> = { part: partTab };

    if (skill === "listening") {
      if (partTab === "part1") initialValues.questions = [{}];
      else if (partTab === "part4") initialValues.questions = [{}, {}];
      else if (partTab === "part3") initialValues.opinions = [{}, {}, {}, {}];
      else if (partTab === "part2") {
        initialValues.opinionPool = [{}, {}, {}, {}, {}, {}];
        initialValues.speakerAnswers = [null, null, null, null];
      }
    } else if (skill === "reading") {
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
    } else if (skill === "writing") {
      if (partTab === "part1") initialValues.p1Questions = Array(5).fill("");
      else if (partTab === "part3")
        initialValues.p3MemberQuestions = [
          { member: "Member A", question: "" },
          { member: "Member B", question: "" },
          { member: "Member C", question: "" },
        ];
    } else if (skill === "speaking") {
      if (partTab === "part1") initialValues.p1Questions = Array(3).fill("");
    } else {
      // Grammar / Vocabulary
      if (partTab === "grammar" || skill === "grammar") {
        initialValues.gramQuestions = Array(25).fill({
          optA: "",
          optB: "",
          optC: "",
          answer: "A",
        });
      }
      if (partTab.startsWith("vocab")) {
        initialValues.vocabPool = Array(10).fill("");
        initialValues.vocabQuestions = Array(5).fill({
          question: "",
          answerIndex: null,
        });
      }
    }

    form.setFieldsValue(initialValues);
    setSelectedQuestion(null);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = async () => {
    // Validate để antd highlight field lỗi; bỏ qua lỗi giả từ field ở bước khác đang unmount
    try {
      await form.validateFields();
    } catch {
      /* form nhiều bước: không chặn ở đây, để mapper + BE kiểm tra tiếp */
    }

    // QUAN TRỌNG: getFieldsValue(true) lấy TOÀN BỘ field kể cả bước đã unmount (part, title, audioUrl...).
    // Nếu bỏ `true`, `part` sẽ mất -> mapper mặc định về part1 -> build sai (content/extraConfig rỗng).
    const values = form.getFieldsValue(true);
    const payloads = buildCreatePayloads(skill, values);

    const invalid = payloads.find((p) => !p.content || !p.content.trim());
    if (payloads.length === 0 || invalid) {
      message.warning("Chưa đủ dữ liệu hợp lệ (nội dung câu hỏi đang trống). Vui lòng kiểm tra lại các bước.");
      return;
    }

    createMutation.mutate(payloads, {
      onSuccess: (created) => {
        setIsModalOpen(false);
        message.success(`Đã lưu ${created.length} câu hỏi thành công!`);
      },
    });
  };

  const handleDeleteQuestion = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => message.success("Đã xóa câu hỏi."),
    });
  };

  return {
    skillTab: skill,
    setSkillTab: (val: string) =>
      navigate({ to: `/admin/questions/${val}` as string }),
    partTab,
    setPartTab: changePartTab,
    questions,
    total,
    page,
    pageSize,
    onPageChange: onChange,
    isLoading: questionsQuery.isLoading,
    isModalOpen,
    setIsModalOpen,
    selectedQuestion,
    setSelectedQuestion,
    form,
    isSaving: createMutation.isPending,
    handleCreateQuestion,
    handleSaveQuestion,
    handleDeleteQuestion,
    navigate,
  };
};
