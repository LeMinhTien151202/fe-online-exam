import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import { MenuOutlined, BellOutlined } from '@ant-design/icons';
import { Link } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import * as S from '../pages/styled';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <S.MainLayout>
            {/* Sidebar Desktop */}
            <Sidebar />

            {/* Sidebar Mobile */}
            <Drawer
                placement="left"
                onClose={() => setIsMobileMenuOpen(false)}
                open={isMobileMenuOpen}
                bodyStyle={{ padding: 0, background: '#0D2245' }}
                width={280}
                closable={false}
            >
                <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </Drawer>

            <S.RightColumn>
                {/* Mobile Header */}
                <S.MobileHeader>
                    <Link
                        to="/"
                        style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '0.5rem' }}
                    >
                        <S.HeaderLogo src="/image.png" alt="Logo" />
                        <S.HeaderTitle>Aptis Prep</S.HeaderTitle>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Button type="text" icon={<BellOutlined />} />
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={() => setIsMobileMenuOpen(true)}
                        />
                    </div>
                </S.MobileHeader>

                <S.ContentArea>
                    <S.Container>
                        {children}
                    </S.Container>
                </S.ContentArea>
            </S.RightColumn>
        </S.MainLayout>
    );
};
