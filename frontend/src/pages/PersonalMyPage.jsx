import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TopNavBarLoggedIn from '../components/TopNavBarLoggedIn';
import AppFooter from '../components/AppFooter';

import Sidebar from '../components/mypage/Sidebar';
import DashboardContent from '../components/mypage/DashboardContent';
import ApplyStatusContent from '../components/mypage/ApplyStatusContent';
import WorkContent from '../components/mypage/WorkContent';
import ScrapContent from '../components/mypage/ScrapContent';
import InfoEditContent from '../components/mypage/InfoEditContent';
import ResumeContent from '../components/mypage/resume/ResumeContent';
import ReviewContent from '../components/mypage/review/ReviewContent';

import { getMyAccount } from '../services/accountApi';
import { getMyResume } from '../services/resumeApi';

export default function PersonalMyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [account, setAccount] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMyPageData = async () => {
    try {
      setLoading(true);
      setError('');

      const accountData = await getMyAccount();
      setAccount(accountData);

      try {
        const resumeData = await getMyResume();
        setResume(resumeData);
      } catch (resumeErr) {
        if (resumeErr.message === 'Resume not found') {
          setResume(null);
        } else {
          setError(resumeErr.message || '이력서 정보를 불러오지 못했습니다.');
        }
      }
    } catch (err) {
      setError(err.message || '마이페이지 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyPageData();
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    const allowedTabs = ['dashboard', 'status', 'work', 'resume', 'review', 'scrap', 'info'];

    if (tab && allowedTabs.includes(tab) && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [activeTab, searchParams]);

  const handleTabChange = (nextTab) => {
    setActiveTab(nextTab);
    setSearchParams(nextTab === 'dashboard' ? {} : { tab: nextTab });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
            <DashboardContent
                account={account}
                resume={resume}
                loading={loading}
                error={error}
                onMoveInfo={() => handleTabChange('info')}
                onMoveResume={() => handleTabChange('resume')}
            />
        );

      case 'status':
        return <ApplyStatusContent account={account} />;

      case 'work':
        return <WorkContent account={account} />;

      case 'resume':
        return (
            <ResumeContent
                resume={resume}
                onResumeChanged={setResume}
            />
        );

      case 'review':
        return <ReviewContent account={account} />;

      case 'scrap':
        return <ScrapContent />;

      case 'info':
        return (
            <InfoEditContent
                account={account}
                onAccountChanged={setAccount}
            />
        );

      default:
        return (
            <DashboardContent
                account={account}
                resume={resume}
                loading={loading}
                error={error}
                onMoveInfo={() => handleTabChange('info')}
                onMoveResume={() => handleTabChange('resume')}
            />
        );
    }
  };

  return (
      <div className="bg-[#F8F9FA] min-h-screen text-on-surface flex flex-col">
        <TopNavBarLoggedIn />

        <main className="flex-grow w-full custom-container pt-28 pb-12 flex flex-col lg:flex-row gap-8 items-start">
          <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

          <div className="flex-1 min-w-0 w-full">
            {renderContent()}
          </div>
        </main>

        <AppFooter />
      </div>
  );
}