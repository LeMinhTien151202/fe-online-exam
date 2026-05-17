import React, { useState } from 'react';
import { Badge } from 'antd';
import { 
  BellOutlined,
  DownOutlined
} from '@ant-design/icons';
import * as S from './Sidebar.styled';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    doc: true,
    nghe: true,
    noi: false,
    viet: false
  });

  const toggleMenu = (key: string) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderArrow = (isOpen: boolean) => (
    <DownOutlined 
      className="arrow-icon" 
      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
    />
  );

  return (
    <S.SidebarContainer onClick={(e) => e.stopPropagation()}>
      <S.LogoWrapper>
        <img alt="Icon" src="/image.png" />
        <span>Aptis Test</span>
      </S.LogoWrapper>

      <nav className="flex-1 overflow-y-auto">
        <S.NavSection>
          <S.SectionTitle>Luyện tập</S.SectionTitle>
          <div className="space-y-1">
            <S.NavLink href="#" $active onClick={onClose}>
              <span className="material-symbols-outlined">dashboard</span>
              <span>Bảng điều khiển</span>
            </S.NavLink>
            
            <S.NavLink href="#" onClick={onClose}>
              <span className="material-symbols-outlined">spellcheck</span>
              <span>Ngữ pháp & Từ vựng</span>
            </S.NavLink>

            {/* Mục Đọc */}
            <S.NavItemWrapper>
              <S.NavLink as="div" onClick={() => toggleMenu('doc')}>
                <span className="material-symbols-outlined">auto_stories</span>
                <span>Đọc</span>
                {renderArrow(openMenus.doc)}
              </S.NavLink>
              <S.SubMenuWrapper $isOpen={openMenus.doc}>
                <S.NavLink href="#" $isSub onClick={onClose}>Bài tập theo phần</S.NavLink>
                <S.NavLink href="#" $isSub onClick={onClose}>Mẹo làm bài</S.NavLink>
              </S.SubMenuWrapper>
            </S.NavItemWrapper>

            {/* Mục Nghe */}
            <S.NavItemWrapper>
              <S.NavLink as="div" onClick={() => toggleMenu('nghe')}>
                <span className="material-symbols-outlined">headphones</span>
                <span>Nghe</span>
                {renderArrow(openMenus.nghe)}
              </S.NavLink>
              <S.SubMenuWrapper $isOpen={openMenus.nghe}>
                <S.NavLink href="#" $isSub onClick={onClose}>Luyện nghe hội thoại</S.NavLink>
                <S.NavLink href="#" $isSub onClick={onClose}>Luyện nghe thông báo</S.NavLink>
              </S.SubMenuWrapper>
            </S.NavItemWrapper>

            {/* Mục Nói */}
            <S.NavItemWrapper>
              <S.NavLink as="div" onClick={() => toggleMenu('noi')}>
                <span className="material-symbols-outlined">mic</span>
                <span>Nói</span>
                {renderArrow(openMenus.noi)}
              </S.NavLink>
              <S.SubMenuWrapper $isOpen={openMenus.noi}>
                <S.NavLink href="#" $isSub onClick={onClose}>Luyện theo câu hỏi</S.NavLink>
                <S.NavLink href="#" $isSub onClick={onClose}>Mẹo học hay</S.NavLink>
              </S.SubMenuWrapper>
            </S.NavItemWrapper>

            {/* Mục Viết */}
            <S.NavItemWrapper>
              <S.NavLink as="div" onClick={() => toggleMenu('viet')}>
                <span className="material-symbols-outlined">edit_document</span>
                <span>Viết</span>
                {renderArrow(openMenus.viet)}
              </S.NavLink>
              <S.SubMenuWrapper $isOpen={openMenus.viet}>
                <S.NavLink href="#" $isSub onClick={onClose}>Mẫu câu Speaking & Writing</S.NavLink>
                <S.NavLink href="#" $isSub onClick={onClose}>Luyện viết thư</S.NavLink>
              </S.SubMenuWrapper>
            </S.NavItemWrapper>
          </div>
        </S.NavSection>

        <S.NavSection>
          <S.SectionTitle>Tài liệu & Tiện ích</S.SectionTitle>
          <div className="space-y-1">
            <S.ProLink href="#" onClick={onClose}>
              <span className="material-symbols-outlined">stars</span>
              <span>Thi thử</span>
              <Badge status="warning" className="ml-auto" />
            </S.ProLink>
            <S.NavLink href="#" onClick={onClose}>
              <span className="material-symbols-outlined">library_books</span>
              <span>Tài liệu học tập</span>
            </S.NavLink>
            <S.NavLink href="#" onClick={onClose}>
              <span className="material-symbols-outlined">forum</span>
              <span>Góc giải đáp (Q&A)</span>
            </S.NavLink>
          </div>
        </S.NavSection>
      </nav>

      <S.OnlineBadge>
        <div className="dot" />
        <span>1.245 học viên trực tuyến</span>
      </S.OnlineBadge>

      <S.UserProfileCard>
        <div className="avatar">T</div>
        <div className="user-info">
          <div className="name">Thí sinh</div>
          <div className="plan">Gói Miễn phí</div>
        </div>
        <button className="notification-btn">
          <BellOutlined style={{ fontSize: '20px' }} />
          <div className="dot" />
        </button>
      </S.UserProfileCard>
    </S.SidebarContainer>
  );
};
