import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import LoginPage from './pages/login/pages/LoginPage';
import RegisterPage from './pages/register/pages/RegisterPage';
import OAuthCallbackPage from './pages/oauth-callback/pages/OAuthCallbackPage';

export const authLoginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
});

export const authRegisterRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: RegisterPage,
});

export const authOAuthCallbackRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/oauth',
    component: OAuthCallbackPage,
});

export const authRoutes = [authLoginRoute, authRegisterRoute, authOAuthCallbackRoute];
