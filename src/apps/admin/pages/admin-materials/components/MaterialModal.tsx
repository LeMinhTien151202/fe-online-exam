import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { ADMIN_COLORS } from '../../../constants';
import { FileType } from '../services/types';

export interface MaterialFormValues {
  title: string;
  fileType: FileType;
  fileUrl: string;
  skill: string;
  durationSeconds?: number;
}

interface MaterialModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: (values: MaterialFormValues) => void;
  isSaving?: boolean;
}

const MaterialModal: React.FC<MaterialModalProps> = ({ open, onCancel, onSuccess, isSaving }) => {
  const [form] = Form.useForm<MaterialFormValues>();
  const fileType = Form.useWatch('fileType', form);

  React.useEffect(() => {
    if (open) form.setFieldsValue({ fileType: 'PDF' });
    else form.resetFields();
  }, [open, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => onSuccess(values));
  };

  return (
    <Modal
      title="Đăng tải tài liệu học tập"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>Hủy</Button>,
        <Button key="submit" type="primary" loading={isSaving} style={{ background: ADMIN_COLORS.primary }} onClick={handleSubmit}>
          Lưu tài liệu
        </Button>,
      ]}
      width={640}
      centered
    >
      <Form form={form} layout="vertical" style={{ marginTop: '1rem' }}>
        <Form.Item label="Tên tài liệu" name="title" rules={[{ required: true, message: 'Nhập tên tài liệu!' }]}>
          <Input placeholder="Tên hiển thị cho học viên..." />
        </Form.Item>

        <Form.Item label="Loại tệp" name="fileType" initialValue="PDF" rules={[{ required: true }]}>
          <Select
            options={[
              { label: 'PDF', value: 'PDF' },
              { label: 'VIDEO', value: 'VIDEO' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Đường dẫn tệp (URL)" name="fileUrl" rules={[{ required: true, message: 'Dán URL tệp!' }]}>
          <Input placeholder="https://.../grammar.pdf" />
        </Form.Item>

        {fileType === 'VIDEO' && (
          <Form.Item label="Thời lượng video (giây)" name="durationSeconds">
            <Input type="number" placeholder="Ví dụ: 720" />
          </Form.Item>
        )}

        <Form.Item label="Kỹ năng chính" name="skill" rules={[{ required: true, message: 'Chọn kỹ năng liên quan!' }]}>
          <Select
            placeholder="Chọn kỹ năng"
            options={[
              { label: 'Ngữ pháp & Từ vựng', value: 'Grammar' },
              { label: 'Đọc hiểu', value: 'Reading' },
              { label: 'Nghe', value: 'Listening' },
              { label: 'Nói', value: 'Speaking' },
              { label: 'Viết', value: 'Writing' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MaterialModal;
