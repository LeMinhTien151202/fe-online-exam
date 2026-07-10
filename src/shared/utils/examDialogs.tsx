import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import type { ModalFuncProps } from 'antd';
import type { ReactNode } from 'react';
import { APP_COLORS } from '@/configs/antDesign';

/**
 * Hộp thoại xác nhận DÙNG CHUNG cho trang học viên (luyện theo phần / bộ đề / thi thử).
 *
 * Vì các trang gọi Modal.confirm ở dạng static (ngoài cây ConfigProvider) nên nút OK KHÔNG
 * tự nhận màu chủ đạo từ theme -> ở đây ép okButtonProps về màu chủ đạo (#1a365d) để đồng bộ
 * hiệu ứng bấm nút trên mọi form. Icon/tiêu đề/chữ nút cũng chuẩn hoá về 1 mẫu duy nhất.
 */

// Nút OK luôn dùng màu chủ đạo (kể cả hover/active) — thống nhất toàn bộ popup học viên.
const primaryOkButton: ModalFuncProps['okButtonProps'] = {
  style: {
    backgroundColor: APP_COLORS.primary,
    borderColor: APP_COLORS.primary,
    color: '#fff',
    fontWeight: 600,
  },
};

const baseConfirmProps: Partial<ModalFuncProps> = {
  centered: true,
  okButtonProps: primaryOkButton,
  cancelButtonProps: { style: { fontWeight: 600 } },
};

export interface ConfirmSubmitOptions {
  /** Số câu chưa trả lời (0 = đã làm hết). */
  unansweredCount?: number;
  /** Tổng số câu của bài (để hiển thị khi đã làm hết). */
  totalQuestions?: number;
  onOk: () => void | Promise<void>;
}

/** Xác nhận NỘP BÀI — dùng cho mọi loại đề (part / skill-set / mock). */
export const confirmSubmitExam = ({ unansweredCount = 0, totalQuestions, onOk }: ConfirmSubmitOptions) => {
  const hasUnanswered = unansweredCount > 0;
  const doneText =
    totalQuestions != null
      ? `Bạn đã hoàn thành toàn bộ ${totalQuestions} câu. Bạn có chắc chắn muốn nộp bài để chấm điểm không?`
      : 'Bạn có chắc chắn muốn nộp bài để chấm điểm không?';

  Modal.confirm({
    ...baseConfirmProps,
    title: 'Xác nhận nộp bài?',
    icon: <CheckCircleFilled style={{ color: APP_COLORS.success }} />,
    content: hasUnanswered
      ? `Bạn còn ${unansweredCount} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài ngay bây giờ không?`
      : doneText,
    okText: 'Nộp bài',
    cancelText: 'Làm tiếp',
    onOk,
  });
};

export interface ConfirmExitOptions {
  /** Nội dung tuỳ biến (mặc định: cảnh báo tiến độ có thể không được lưu). */
  content?: string;
  onOk: () => void | Promise<void>;
}

/** Xác nhận THOÁT khỏi phòng thi — dùng cho mọi loại đề. */
export const confirmExitExam = ({ content, onOk }: ConfirmExitOptions) => {
  Modal.confirm({
    ...baseConfirmProps,
    title: 'Thoát khỏi phòng thi?',
    icon: <ExclamationCircleFilled style={{ color: APP_COLORS.warning }} />,
    content: content ?? 'Tiến độ làm bài có thể không được lưu nếu bạn thoát ra lúc này.',
    okText: 'Thoát ra',
    cancelText: 'Ở lại làm tiếp',
    onOk,
  });
};

export interface ConfirmExamActionOptions {
  title: string;
  content?: ReactNode;
  okText?: string;
  cancelText?: string;
  onOk: () => void | Promise<void>;
}

/** Hộp thoại xác nhận CHUNG (vd: chuyển phần thi) — vẫn dùng nút màu chủ đạo cho đồng bộ. */
export const confirmExamAction = ({
  title,
  content,
  okText = 'Xác nhận',
  cancelText = 'Huỷ',
  onOk,
}: ConfirmExamActionOptions) => {
  Modal.confirm({
    ...baseConfirmProps,
    title,
    icon: <ExclamationCircleFilled style={{ color: APP_COLORS.info }} />,
    content,
    okText,
    cancelText,
    onOk,
  });
};
