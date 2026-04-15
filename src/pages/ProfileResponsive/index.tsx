import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProfileCard from './components/ProfileCard';

export default () => {
  return (
    <PageContainer title="BÀI TẬP RESPONSIVE PROFILE">
      <div style={{ padding: '20px' }}>
        <ProfileCard 
          name="Nguyễn Văn A"
          image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500"
          description="Chào bạn! Tôi là một lập trình viên đang học tập về cách xây dựng giao diện đáp ứng (Responsive Design). Bài tập này giúp tôi hiểu rõ cách kết hợp giữa CSS và logic React."
        />
      </div>
    </PageContainer>
  );
};