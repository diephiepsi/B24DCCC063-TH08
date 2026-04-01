import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, Card} from 'antd'; 
import { useModel } from 'umi';
import Clubs from './Clubs';
import Applications from './Applications';
import Members from './Members';
import Reports from './Reports';

const TH05Index: React.FC = () => {
  const model = useModel('localStorage.th05' as any); 

  return (
    <PageContainer title="HỆ THỐNG QUẢN LÝ CÂU LẠC BỘ (TH05)">
      <Card bordered={false}>
        <Tabs defaultActiveKey="1" type="card">
          {/* Tab 1: Quản lý danh sách CLB */}
          <Tabs.TabPane tab="1. Danh sách CLB" key="1">
            <Clubs {...model} /> 
          </Tabs.TabPane>

          {/* Tab 2: Xử lý Đơn đăng ký */}
          <Tabs.TabPane tab="2. Đơn đăng ký" key="2">
            <Applications {...model} />
          </Tabs.TabPane>

          {/* Tab 3: Quản lý Thành viên & Chuyển CLB */}
          <Tabs.TabPane tab="3. Thành viên" key="3">
            <Members {...model} />
          </Tabs.TabPane>

          {/* Tab 4: Báo cáo & Thống kê */}
          <Tabs.TabPane tab="4. Báo cáo" key="4">
            <Reports {...model} />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default TH05Index;