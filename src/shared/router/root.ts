import { createRootRoute } from '@tanstack/react-router';
import { RootAuthGate } from '@/shared/auth/RootAuthGate';

// Root Route chung để làm gốc cho tất cả các Route con.
// RootAuthGate render <Outlet/> kèm guard đăng nhập (trừ trang public: /, /login, /register, /oauth, /faq).
export const rootRoute = createRootRoute({ component: RootAuthGate });
