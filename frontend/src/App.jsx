import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import HumanInformationPage from './pages/HumanInformationPage';
import RecruitInformationPage from './pages/RecruitInformationPage';
import RecruitDetailPage from './pages/RecruitDetailPage';
import BrandPage from './pages/BrandPage';
import AiRecommendPage from './pages/AiRecommendPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import ApplyFormPage from './pages/ApplyFormPage';
import ApplyCompletePage from './pages/ApplyCompletePage';
import LoginPage from './pages/LoginPage';
import PersonalSignUpPage from './pages/PersonalSignUpPage';
import BusinessSignUpPage from './pages/BusinessSignUpPage';
import BrandRecruitExplorePage from './pages/BrandRecruitExplorePage';
import BusinessMyPage from './pages/BusinessMyPage';
import BusinessCompanyEditPage from './pages/BusinessCompanyEditPage';
import BusinessRecruitCreatePage from './pages/BusinessRecruitCreatePage';
import PersonalMyPage from './pages/PersonalMyPage';
import KakaoOAuthCallbackPage from './pages/KakaoOAuthCallbackPage';
import TalentProfilePage from './pages/TalentProfilePage';
import GlobalAiChatbotButton from './components/GlobalAiChatbotButton';
import MyPageRouter from './pages/MyPageRouter';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/brand" element={<BrandPage />} />
        <Route path="/brand/recruits" element={<BrandRecruitExplorePage />} />
        <Route path="/ai-recommend" element={<AiRecommendPage />} />
        <Route path="/human-information" element={<HumanInformationPage />} />
        <Route path="/recruit-information" element={<RecruitInformationPage />} />
        <Route path="/recruit-detail" element={<RecruitDetailPage />} />
        <Route path="/company-detail" element={<CompanyDetailPage />} />
        <Route path="/apply-form" element={<ApplyFormPage />} />
        <Route path="/apply-complete" element={<ApplyCompletePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/oauth2/callback" element={<KakaoOAuthCallbackPage />} />
        <Route path="/signup/personal" element={<PersonalSignUpPage />} />
        <Route path="/signup/business" element={<BusinessSignUpPage />} />
        <Route path="/dashboard" element={<BusinessMyPage />} />
        <Route path="/dashboard/company-edit" element={<BusinessCompanyEditPage />} />
        <Route path="/dashboard/recruit-create" element={<BusinessRecruitCreatePage />} />
        <Route path="/mypage" element={<MyPageRouter />} />
        <Route path="/personal-mypage" element={<PersonalMyPage />} />
        <Route path="/business-mypage" element={<BusinessMyPage />} />
        <Route path="/talent-profile/:resumeId" element={<TalentProfilePage />} />
      </Routes>
      <GlobalAiChatbotButton />
    </Router>
  );
}

export default App;
