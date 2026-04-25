import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopNavBarLoggedIn from '../components/TopNavBarLoggedIn';
import AppFooter from '../components/AppFooter';

import BusinessSidebar from '../components/business-mypage/BusinessSidebar';
import { businessSidebarItems } from '../components/business-mypage/businessSidebarItems';
import BusinessDashboardTab from '../components/business-mypage/tabs/BusinessDashboardTab';
import BusinessRecruitsTab from '../components/business-mypage/tabs/BusinessRecruitsTab';
import BusinessApplicantsTab from '../components/business-mypage/tabs/BusinessApplicantsTab';
import BusinessReviewsTab from '../components/business-mypage/tabs/BusinessReviewsTab';
import BusinessWorkTab from '../components/business-mypage/tabs/BusinessWorkTab';
import BusinessScrapTab from '../components/business-mypage/tabs/BusinessScrapTab';
import { getMyBusinessAccountMe, getMyBusinessAccountSummary } from '../services/accountApi';

const validTabs = new Set(businessSidebarItems.map((item) => item.id));

export default function BusinessMyPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [companySummary, setCompanySummary] = useState(null);

  const queryTab = searchParams.get('tab');
  const activeTab = validTabs.has(queryTab) ? queryTab : 'dashboard';

  const changeTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  useEffect(() => {
    let mounted = true;

    const resolveBrandLogoUrl = async (brandId) => {
      if (brandId == null) return '';
      try {
        const response = await fetch(`/api/brand/${encodeURIComponent(brandId)}/summary`);
        if (!response.ok) return '';
        const result = await response.json();
        return result?.logoImg || '';
      } catch {
        return '';
      }
    };

    const fetchCompanySummary = async () => {
      try {
        const [summary, me] = await Promise.all([
          getMyBusinessAccountSummary(),
          getMyBusinessAccountMe(),
        ]);
        const brandLogoUrl = await resolveBrandLogoUrl(me?.brandId);
        if (mounted) {
          setCompanySummary({
            ...summary,
            brandId: me?.brandId ?? null,
            brandLogoUrl,
            companyImageUrl: summary?.companyImageUrl || me?.companyImageUrl || '',
          });
        }
      } catch {
        if (mounted) {
          setCompanySummary(null);
        }
      }
    };

    fetchCompanySummary();

    return () => {
      mounted = false;
    };
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <BusinessDashboardTab />;
      case 'recruits':
        return <BusinessRecruitsTab />;
      case 'applicants':
        return <BusinessApplicantsTab />;
      case 'reviews':
        return <BusinessReviewsTab />;
      case 'work':
        return <BusinessWorkTab />;
      case 'scrap':
        return <BusinessScrapTab />;
      default:
        return <BusinessDashboardTab />;
    }
  };

  return (
      <div className="bg-[#F8F9FA] min-h-screen text-on-surface">
        <TopNavBarLoggedIn />

        <div className="pt-20 min-h-screen">
          <div className="custom-container py-8 flex flex-col lg:flex-row gap-8">
            <BusinessSidebar
                activeTab={activeTab}
                onChangeTab={changeTab}
                navigate={navigate}
                companySummary={companySummary}
            />
            <main className="flex-1 min-w-0">{renderTab()}</main>
          </div>
        </div>

        <AppFooter />
      </div>
  );
}