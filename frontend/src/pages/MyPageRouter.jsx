import React from 'react';
import { Navigate } from 'react-router-dom';

export default function MyPageRouter() {
    const token = localStorage.getItem('token');
    const memberStr = localStorage.getItem('member');

    if (!token || !memberStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        const member = JSON.parse(memberStr);
        const memberType = member?.memberType;

        if (memberType === 'INDIVIDUAL') {
            return <Navigate to="/personal-mypage" replace />;
        }

        if (memberType === 'BUSINESS') {
            return <Navigate to="/business-mypage" replace />;
        }

        return <Navigate to="/" replace />;
    } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('member');
        return <Navigate to="/login" replace />;
    }
}