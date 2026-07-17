import { useNavigate, useSearch } from '@tanstack/react-router';

export type LandingTab = 'parts' | 'mock-tests';

// Tab của trang landing kỹ năng đồng bộ với URL (?tab=mock-tests)
// để sidebar có thể điều hướng thẳng tới tab và highlight đúng mục.
export const useLandingTab = () => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { tab?: string };
  const activeTab: LandingTab = search?.tab === 'mock-tests' ? 'mock-tests' : 'parts';

  const setActiveTab = (tab: LandingTab) => {
    // Route kỹ năng chưa khai báo validateSearch nên phải ép kiểu search
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ search: (tab === 'mock-tests' ? { tab } : {}) as any, replace: true });
  };

  return { activeTab, setActiveTab };
};
