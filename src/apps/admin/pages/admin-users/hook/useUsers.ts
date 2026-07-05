import { useMemo, useState } from 'react';
import { message } from 'antd';
import { initialPermissions } from '../services/mockData';
import {
  useCreateUserMutation,
  useLockUserMutation,
  useUpdateUserMutation,
  useUsersQuery,
} from '../services/userQuery';
import { IAdminUser, IUserRow, UserRole } from '../services/types';
import { usePagination } from '@/shared/hooks/usePagination';

// Chuỗi ngày học tập chưa có API -> tạm fake theo id để giá trị ổn định giữa các lần render
const fakeStreak = (id: number) => (id * 7) % 30;

const mapRow = (u: IAdminUser): IUserRow => ({
  key: String(u.id),
  id: u.id,
  name: u.profile?.fullName || u.email,
  email: u.email,
  role: u.role,
  target: u.profile?.aptisGoal || '—',
  registeredDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '',
  active: u.status === 'ACTIVE',
  streak: fakeStreak(u.id),
  raw: u,
});

interface CreateUserFormValues {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export const useUsers = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedStudent, setSelectedStudent] = useState<IUserRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [permissions, setPermissions] = useState(initialPermissions);

  const { page, pageSize, onChange, reset } = usePagination(10);
  const { data, isLoading } = useUsersQuery({ page, limit: pageSize });
  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const lockMutation = useLockUserMutation();

  const students = useMemo(() => (data?.data ?? []).map(mapRow), [data]);
  const total = data?.metaData?.total ?? 0;

  // active=true -> mở khoá (status ACTIVE); active=false -> khoá
  const handleStatusChange = (active: boolean, key: string) => {
    const id = Number(key);
    if (active) {
      updateMutation.mutate(
        { id, payload: { status: 'ACTIVE' } },
        { onSuccess: () => message.success('Đã mở khoá tài khoản.') }
      );
    } else {
      lockMutation.mutate(id, { onSuccess: () => message.success('Đã khoá tài khoản.') });
    }
  };

  const handleCreate = (values: CreateUserFormValues, onDone?: () => void) => {
    createMutation.mutate(
      { email: values.email, password: values.password, full_name: values.fullName, role: values.role },
      {
        onSuccess: () => {
          reset();
          message.success('Đã thêm người dùng.');
          onDone?.();
        },
      }
    );
  };

  const handleOpenDrawer = (record: IUserRow) => {
    setSelectedStudent(record);
    setDrawerOpen(true);
  };

  return {
    activeTab,
    setActiveTab,
    students,
    isLoading,
    total,
    page,
    pageSize,
    onPageChange: onChange,
    isCreating: createMutation.isPending,
    selectedStudent,
    drawerOpen,
    setDrawerOpen,
    permissions,
    setPermissions,
    handleStatusChange,
    handleCreate,
    handleOpenDrawer,
  };
};
