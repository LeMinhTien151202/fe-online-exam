import { FormInstance } from 'antd';
import { z } from 'zod';

/**
 * Utility để validate Ant Design Form bằng Zod Schema
 * @param schema Zod Schema
 * @returns Rule object cho Ant Design Form
 */
export const zodValidator = (schema: z.ZodType) => {
  return {
    async validator(_: unknown, value: unknown) {
      if (value === undefined || value === null || value === '') {
        return Promise.resolve();
      }
      try {
        schema.parse(value);
        return Promise.resolve();
      } catch (err) {
        if (err instanceof z.ZodError) {
          return Promise.reject(err.issues[0].message);
        }
        return Promise.reject('Dữ liệu không hợp lệ');
      }
    },
  };
};

/**
 * Helper để map lỗi từ ZodError về Ant Design Form fields
 * Thường dùng trong onFinish khi validate toàn bộ object
 */
export const handleZodError = (error: unknown, form: FormInstance) => {
  if (error instanceof z.ZodError) {
    const fieldErrors = error.issues.map((issue) => ({
      name: issue.path as string[],
      errors: [issue.message],
    }));
    form.setFields(fieldErrors);
  }
};
