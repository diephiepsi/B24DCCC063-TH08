import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, Card, Typography } from 'antd';
import { useModel } from 'umi';
import { CompassOutlined, CalendarOutlined, PieChartOutlined, SettingOutlined } from '@ant-design/icons';

// Import 4 component từ thư mục components
import Explore from './components/Home';
import Itinerary from './components/Itinerary';
import BudgetManager from './components/BudgetManager';
import Admin from './components/Admin';

const TH06Index: React.FC = () => {
  const model = useModel('localStorage.th06' as any);

  return (
    <PageContainer 
      title={<Typography.Title level={3} style={{ margin: 0 }}>ỨNG DỤNG LẬP KẾ HOẠCH DU LỊCH</Typography.Title>}
      subTitle="Thiết kế và tối ưu hóa chuyến đi của bạn"
    >
      <Card bordered={false} style={{ minHeight: '80vh', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Tabs defaultActiveKey="1" type="line" size="large">
          
          <Tabs.TabPane 
            tab={<span><CompassOutlined /> Khám phá</span>} 
            key="1"
          >
            <Explore {...model} />
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={<span><CalendarOutlined /> Lịch trình</span>} 
            key="2"
          >
            <Itinerary {...model} />
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={<span><PieChartOutlined /> Ngân sách</span>} 
            key="3"
          >
            <BudgetManager {...model} />
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={<span><SettingOutlined /> Quản trị (Admin)</span>} 
            key="4"
          >
            <Admin {...model} />
          </Tabs.TabPane>

        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default TH06Index;