import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { useAccountQuery } from '@apps/auth/services/authQuery';
import { useAppSelector } from '@/shared/store/hooks';
import { tokenManager } from '@/shared/utils/tokenManager';
import { BYPASS_ROLE, UserRole, hasAnyRole, roleHomePath } from './roleAccess';

interface RequireRoleProps {
  allow: UserRole[];
  children: React.ReactNode;
}

const FullScreenSpin: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <Spin size="large" description="Đang kiểm tra quyền truy cập..." />
  </div>
);

// Guard route theo RBAC cố định. Chờ bootstrap phiên xong rồi mới quyết định.
// Chưa đăng nhập -> /login. Sai vai trò -> về trang mặc định của vai trò hiện tại.
export const RequireRole: React.FC<RequireRoleProps> = ({ allow, children }) => {
  const navigate = useNavigate();
  // Cùng queryKey với useAuthBootstrap nên được dedup, chỉ để biết trạng thái đang tải phiên.
  const { isLoading } = useAccountQuery();
  const user = useAppSelector((s) => s.auth.user);
  const hasToken = !!tokenManager.getAccessToken();

  // Còn token nhưng redux chưa có user -> phiên đang được khôi phục, chưa kết luận vội.
  const bootstrapping = isLoading || (hasToken && !user);
  const role = (user?.role as UserRole | undefined) ?? undefined;
  const allowed = BYPASS_ROLE ? !!user : hasAnyRole(role, allow);

  useEffect(() => {
    if (bootstrapping) return;
    if (!user) {
      navigate({ to: '/login', replace: true });
      return;
    }
    if (!allowed) {
      navigate({ to: roleHomePath(role) as string, replace: true });
    }
  }, [bootstrapping, user, allowed, role, navigate]);

  if (bootstrapping || !user || !allowed) return <FullScreenSpin />;
  return <>{children}</>;
};

export default RequireRole;
