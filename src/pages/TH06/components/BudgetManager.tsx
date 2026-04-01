import { Card, Row, Col, Statistic, Progress, Alert, InputNumber, Typography, Space, Divider } from 'antd';
import { WalletOutlined, RestOutlined, HomeOutlined, CarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const BudgetManager = (props: any) => {
  const { itinerary, budgetLimit, setBudgetLimit } = props;

  // Tính toán số liệu
  const totalFood = itinerary?.reduce((sum: number, item: any) => sum + (item.foodCost || 0), 0) || 0;
  const totalStay = itinerary?.reduce((sum: number, item: any) => sum + (item.stayCost || 0), 0) || 0;
  const totalMove = itinerary?.reduce((sum: number, item: any) => sum + (item.moveCost || 0), 0) || 0;
  
  const totalSpent = totalFood + totalStay + totalMove;
  const percentUsed = budgetLimit > 0 ? Math.round((totalSpent / budgetLimit) * 100) : 0;

  return (
    <Card bordered={false}>
      <Title level={4}><WalletOutlined /> Quản lý Ngân sách</Title>
      
      <Row gutter={[32, 32]} style={{ marginTop: 24 }}>
        <Col xs={24} md={10}>
          <div style={{ padding: 20, background: '#fafafa', borderRadius: 8 }}>
            <Text strong>Thiết lập Ngân sách tối đa (VNĐ):</Text>
            <InputNumber 
              style={{ width: '100%', marginTop: 8 }} size="large" min={0} step={500000}
              value={budgetLimit} onChange={(v) => setBudgetLimit(v || 0)} 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </div>

          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            {/* Biểu đồ phần trăm ngân sách */}
            <Progress 
              type="dashboard" 
              percent={percentUsed > 100 ? 100 : percentUsed} 
              status={percentUsed > 100 ? 'exception' : 'normal'}
              strokeColor={percentUsed > 100 ? '#ff4d4f' : percentUsed >= 80 ? '#faad14' : '#52c41a'}
              format={() => (
                <div>
                  <div style={{ fontSize: 14, color: '#8c8c8c' }}>Đã dùng</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>{percentUsed}%</div>
                </div>
              )}
            />
          </div>

          {percentUsed > 100 ? (
            <Alert message="VƯỢT NGÂN SÁCH!" description={`Bạn đã chi tiêu lố ${(totalSpent - budgetLimit).toLocaleString()} VNĐ.`} type="error" showIcon />
          ) : percentUsed >= 80 ? (
            <Alert message="CẢNH BÁO!" description="Ngân sách sắp cạn kiệt, hãy chi tiêu hợp lý." type="warning" showIcon />
          ) : (
            <Alert message="Ngân sách an toàn" description="Bạn vẫn đang kiểm soát tốt chi phí." type="success" showIcon />
          )}
        </Col>

        <Col xs={24} md={14}>
          <Row gutter={[16, 16]}>
            <Col span={12}><Card size="small"><Statistic title="Tổng chi phí thực tế" value={totalSpent} suffix="đ" valueStyle={{ color: percentUsed > 100 ? '#cf1322' : '#3f8600' }} /></Card></Col>
            <Col span={12}><Card size="small"><Statistic title="Ngân sách còn lại" value={budgetLimit - totalSpent > 0 ? budgetLimit - totalSpent : 0} suffix="đ" valueStyle={{ color: '#1890ff' }} /></Card></Col>
          </Row>

          <Divider orientation="left">Biểu đồ Phân bổ Hạng mục (Charts)</Divider>
          
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong><RestOutlined style={{ color: '#ff4d4f' }} /> Ăn uống</Text>
                <Text>{totalFood.toLocaleString()} đ</Text>
              </div>
              <Progress percent={totalSpent > 0 ? Math.round((totalFood/totalSpent)*100) : 0} strokeColor="#ff4d4f" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong><HomeOutlined style={{ color: '#1890ff' }} /> Lưu trú</Text>
                <Text>{totalStay.toLocaleString()} đ</Text>
              </div>
              <Progress percent={totalSpent > 0 ? Math.round((totalStay/totalSpent)*100) : 0} strokeColor="#1890ff" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong><CarOutlined style={{ color: '#52c41a' }} /> Di chuyển</Text>
                <Text>{totalMove.toLocaleString()} đ</Text>
              </div>
              <Progress percent={totalSpent > 0 ? Math.round((totalMove/totalSpent)*100) : 0} strokeColor="#52c41a" />
            </div>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default BudgetManager;