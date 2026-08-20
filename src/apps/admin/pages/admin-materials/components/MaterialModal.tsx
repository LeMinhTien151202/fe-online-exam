import React from 'react';
import { toast } from '../../../../../configs/toast';
import { Modal, Form, Input, Select, Button, Upload } from 'antd';
import type { UploadRequestOption } from '@rc-component/upload/lib/interface';
import { CloudUploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { FE_SKILL_TO_ID, FileType, ID_TO_FE_SKILL, IMaterial } from '../services/types';
import { questionApi } from '@/apps/admin/pages/admin-questions/services/questionApi';

export interface MaterialFormValues {
  title: string;
  fileType: FileType;
  fileUrl: string;
  skill: string;
  durationSeconds?: number | null;
}

interface MaterialModalProps {
  open: boolean;
  initialValue?: IMaterial | null;
  onCancel: () => void;
  onSuccess: (values: MaterialFormValues) => Promise<void>;
  isSaving?: boolean;
}

const FILE_TYPE_OPTIONS: { label: string; value: FileType }[] = [
  { label: 'PDF', value: 'PDF' },
  { label: 'Audio (MP3/WAV/M4A/OGG/WebM)', value: 'AUDIO' },
  { label: 'Video (MP4/WebM)', value: 'VIDEO' },
  { label: 'Word (DOCX)', value: 'DOCX' },
  { label: 'PowerPoint (PPTX)', value: 'PPTX' },
  { label: 'Excel (XLSX)', value: 'XLSX' },
  { label: 'Tệp nén (ZIP)', value: 'ZIP' },
  { label: 'Liên kết ngoài', value: 'LINK' },
];

const ACCEPT_BY_TYPE: Record<Exclude<FileType, 'LINK'>, string> = {
  PDF: '.pdf,application/pdf',
  AUDIO: '.mp3,.wav,.m4a,.ogg,.webm,audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/webm',
  VIDEO: '.mp4,.webm,video/mp4,video/webm',
  DOCX: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  PPTX: '.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation',
  XLSX: '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ZIP: '.zip,application/zip',
};

const MaterialModal: React.FC<MaterialModalProps> = ({ open, initialValue, onCancel, onSuccess, isSaving }) => {
  const [form] = Form.useForm<MaterialFormValues>();
  const fileType = Form.useWatch('fileType', form) ?? 'PDF';
  const fileUrl = Form.useWatch('fileUrl', form);
  const [isUploading, setIsUploading] = React.useState(false);
  const [temporaryUploadUrl, setTemporaryUploadUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    form.setFieldsValue(initialValue ? {
      title: initialValue.title,
      fileType: initialValue.fileType,
      fileUrl: initialValue.fileUrl,
      skill: initialValue.skillId ? ID_TO_FE_SKILL[initialValue.skillId] : undefined,
      durationSeconds: initialValue.durationSeconds,
    } : {
      title: '',
      fileType: 'PDF',
      fileUrl: '',
      skill: undefined,
      durationSeconds: null,
    });
  }, [form, initialValue, open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSuccess(values);
      setTemporaryUploadUrl(null);
    } catch {
      // Validation/API interceptor đã hiển thị lỗi; giữ modal và file tạm để người dùng thử lại.
    }
  };

  const cleanupTemporaryUpload = async () => {
    if (!temporaryUploadUrl) return;
    try {
      await questionApi.deleteFile({ url: temporaryUploadUrl });
    } catch {
      // Cleanup là best-effort; backend đã log/metric lỗi xóa storage.
    } finally {
      setTemporaryUploadUrl(null);
    }
  };

  const handleCancel = async () => {
    await cleanupTemporaryUpload();
    onCancel();
  };

  const handleCustomUpload = async ({ file, onSuccess: uploadOk, onError }: UploadRequestOption) => {
    if (fileType === 'LINK') return;
    setIsUploading(true);
    try {
      const folderType = fileType === 'VIDEO' ? 'videos' : fileType === 'AUDIO' ? 'audio' : 'documents';
      const result = await questionApi.upload(file as File, folderType, `materials/${fileType.toLowerCase()}`);
      const previousTemporaryUrl = temporaryUploadUrl;
      form.setFieldValue('fileUrl', result.url);
      setTemporaryUploadUrl(result.url);
      if (previousTemporaryUrl && previousTemporaryUrl !== result.url) {
        questionApi.deleteFile({ url: previousTemporaryUrl }).catch(() => undefined);
      }
      toast.success('Tải tệp lên thành công.');
      uploadOk?.(result);
    } catch (error) {
      onError?.(error as Error);
      toast.error('Tải tệp lên thất bại. Vui lòng kiểm tra đúng định dạng và dung lượng.');
    } finally {
      setIsUploading(false);
    }
  };

  const changeFileType = (next: FileType) => {
    if (next !== fileType) {
      cleanupTemporaryUpload();
      form.setFieldsValue({ fileType: next, fileUrl: '', durationSeconds: null });
    }
  };

  return (
    <Modal
      title={initialValue ? 'Cập nhật tài liệu học tập' : 'Đăng tải tài liệu học tập'}
      open={open}
      onCancel={handleCancel}
      destroyOnHidden
      footer={[
        <Button key="back" onClick={handleCancel}>Hủy</Button>,
        <Button key="submit" type="primary" loading={isSaving || isUploading}
          style={{ background: ADMIN_COLORS.primary }} onClick={handleSubmit}>
          {initialValue ? 'Cập nhật' : 'Lưu tài liệu'}
        </Button>,
      ]}
      width={640}
      centered
    >
      <Form form={form} layout="vertical" style={{ marginTop: '1rem' }}>
        <Form.Item label="Tên tài liệu" name="title" rules={[{ required: true, message: 'Nhập tên tài liệu.' }]}>
          <Input placeholder="Tên hiển thị cho học viên..." />
        </Form.Item>

        <Form.Item label="Loại tài liệu" name="fileType" rules={[{ required: true }]}>
          <Select options={FILE_TYPE_OPTIONS} onChange={changeFileType} />
        </Form.Item>

        <Form.Item name="fileUrl" hidden rules={[{ required: true, message: 'Hãy tải tệp hoặc nhập liên kết.' }]}>
          <Input />
        </Form.Item>

        {fileType === 'LINK' ? (
          <Form.Item label="Đường dẫn tài liệu" required>
            <Input value={fileUrl} placeholder="https://..."
              onChange={(event) => form.setFieldValue('fileUrl', event.target.value)} />
          </Form.Item>
        ) : (
          <Form.Item label="Tải tệp tài liệu" required>
            <Upload.Dragger name="file" multiple={false} customRequest={handleCustomUpload}
              showUploadList={false} disabled={isUploading} accept={ACCEPT_BY_TYPE[fileType]}>
              {isUploading ? (
                <p className="ant-upload-text">Đang tải tệp lên, vui lòng đợi...</p>
              ) : fileUrl ? (
                <div style={{ padding: '8px 0' }}>
                  <CheckCircleOutlined style={{ fontSize: 28, color: '#10b981', marginBottom: 8 }} />
                  <p className="ant-upload-text" style={{ color: '#10b981', fontWeight: 600 }}>Tệp đã sẵn sàng</p>
                  <p className="ant-upload-hint" style={{ fontSize: 12, wordBreak: 'break-all', padding: '0 16px' }}>
                    {fileUrl}
                  </p>
                </div>
              ) : (
                <div>
                  <CloudUploadOutlined style={{ fontSize: 28, color: ADMIN_COLORS.primary, marginBottom: 8 }} />
                  <p className="ant-upload-text">Kéo thả tệp vào đây hoặc nhấp để chọn</p>
                  <p className="ant-upload-hint">
                    {fileType === 'VIDEO'
                      ? 'MP4/WebM, tối đa 200MB'
                      : fileType === 'AUDIO'
                        ? 'MP3/WAV/M4A/OGG/WebM, tối đa 20MB'
                        : 'PDF/DOCX/PPTX/XLSX/ZIP, tối đa 50MB'}
                  </p>
                </div>
              )}
            </Upload.Dragger>
          </Form.Item>
        )}

        {fileType === 'VIDEO' && (
          <Form.Item label="Thời lượng video (giây)" name="durationSeconds"
            rules={[{ required: true, message: 'Nhập thời lượng video.' }]}>
            <Input type="number" min={0} placeholder="Ví dụ: 720" />
          </Form.Item>
        )}

        <Form.Item label="Kỹ năng chính" name="skill" rules={[{ required: true, message: 'Chọn kỹ năng.' }]}>
          <Select placeholder="Chọn kỹ năng" options={Object.keys(FE_SKILL_TO_ID).map((value) => ({
            value,
            label: value === 'Grammar' ? 'Ngữ pháp & Từ vựng' : value,
          }))} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MaterialModal;
