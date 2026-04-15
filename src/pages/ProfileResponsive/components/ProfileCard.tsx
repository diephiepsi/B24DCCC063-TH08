import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Tag, Divider } from 'antd';
import './ProfileCard.less';

interface ProfileProps {
  name: string;
  image: string;
  description: string;
}

const ProfileCard: React.FC<ProfileProps> = ({ name, image, description }) => {
  // REQ 3: Khai báo các mốc màn hình bằng react-responsive
  const isDesktop = useMediaQuery({ minWidth: 769 });
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="profileCard">
      <div className="imageSection">
        <img src={image} alt={name} />
      </div>

      <div className="infoSection">
        {/* Nội dung khác nhau dựa trên thiết bị */}
        {isDesktop && <Tag color="blue">Chế độ Desktop</Tag>}
        {isMobile && <Tag color="green">Chế độ Mobile</Tag>}
        
        <h2>{name}</h2>
        
        {/* Ví dụ hiển thị nội dung chi tiết hơn trên Desktop */}
        <p>{description}</p>
        
        {isDesktop && (
          <>
            <Divider />
            <p style={{ fontStyle: 'italic', fontSize: '12px' }}>
              Dòng chữ này chỉ xuất hiện khi bạn xem trên màn hình lớn.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;