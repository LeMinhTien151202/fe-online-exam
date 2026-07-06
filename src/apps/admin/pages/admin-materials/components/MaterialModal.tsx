import React from 'react';
import { Modal, Form, Input, Select, Button, Upload, message } from 'antd';
import { CloudUploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { FileType } from '../services/types';
import { questionApi } from '@/apps/admin/pages/admin-questions/services/questionApi';

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
  const fileUrl = Form.useWatch('fileUrl', form);

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadedFileName, setUploadedFileName] = React.useState<string>('');

  React.useEffect(() => {
    if (open) {
      form.setFieldsValue({ fileType: 'PDF' });
      setUploadedFileName('');
    } else {
      form.resetFields();
      setUploadedFileName('');
    }
  }, [open, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => onSuccess(values));
  };

  const handleCustomUpload = async (options: any) => {
    const { file, onSuccess: onUploadSuccess, onError: onUploadError } = options;
    setIsUploading(true);
    try {
      // Upload using questionApi with folder_type='images' as required
      const res = await questionApi.upload(file as File, 'images');
      form.setFieldsValue({ fileUrl: res.url });
      setUploadedFileName(file.name);
      message.success('Tải tệp lên thành công!');
      if (onUploadSuccess) onUploadSuccess(res);
    } catch (err: any) {
      console.error('File upload error:', err);
      const errMsg = err?.response?.data?.message || 'Tải tệp lên thất bại!';
      message.error(errMsg);
      if (onUploadError) onUploadError(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      title="Đăng tải tài liệu học tập"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>Hủy</Button>,
        <Button key="submit" type="primary" loading={isSaving || isUploading} style={{ background: ADMIN_COLORS.primary }} onClick={handleSubmit}>
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

        <Form.Item label="Đường dẫn tệp (URL)" name="fileUrl" style={{ display: 'none' }}>
          <Input />
        </Form.Item>

        <Form.Item label="Tải lên tệp tài liệu" required>
          <Upload.Dragger
            name="file"
            multiple={false}
            customRequest={handleCustomUpload}
            showUploadList={false}
            disabled={isUploading}
            accept={fileType === 'VIDEO' ? 'video/*' : '.pdf,image/*,.doc,.docx'}
          >
            {isUploading ? (
              <p className="ant-upload-text">Đang tải tệp lên, vui lòng đợi...</p>
            ) : fileUrl ? (
              <div style={{ padding: '8px 0' }}>
                <CheckCircleOutlined style={{ fontSize: '28px', color: '#10b981', marginBottom: '8px' }} />
                <p className="ant-upload-text" style={{ color: '#10b981', fontWeight: 600 }}>Tải lên thành công!</p>
                <p className="ant-upload-hint" style={{ fontSize: '12px', wordBreak: 'break-all', padding: '0 16px' }}>
                  {uploadedFileName || fileUrl}
                </p>
              </div>
            ) : (
              <div>
                <CloudUploadOutlined style={{ fontSize: '28px', color: ADMIN_COLORS.primary, marginBottom: '8px' }} />
                <p className="ant-upload-text">Kéo thả tệp vào đây hoặc nhấp để tải từ máy tính</p>
                <p className="ant-upload-hint">
                  {fileType === 'VIDEO' ? 'Hỗ trợ video MP4, WebM (≤ 20MB)' : 'Hỗ trợ tệp PDF, tài liệu Word hoặc hình ảnh (≤ 5MB)'}
                </p>
              </div>
            )}
          </Upload.Dragger>
        </Form.Item>

        {fileType === 'VIDEO' && (
          <Form.Item label="Thời lượng video (giây)" name="durationSeconds" rules={[{ required: true, message: 'Nhập thời lượng video!' }]}>
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
