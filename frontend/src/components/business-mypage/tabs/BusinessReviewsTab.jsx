import React from 'react';
import ReviewContent from '../../mypage/review/ReviewContent';

export default function BusinessReviewsTab() {
    const member = JSON.parse(localStorage.getItem('member') || 'null');

    return <ReviewContent account={member} />;
}