import { useState } from 'react';
import { Card, Row, Col, Rate, Tag, Select, Space, Empty, Button, Typography, message } from 'antd';
import { EnvironmentOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Explore = (props: any) => {
  const { destinations, itinerary, setItinerary } = props;
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('none');

  // Logic Lọc & Sắp xếp
  const displayedData = destinations?.filter((d: any) => filterType === 'all' || d.type === filterType) || [];
  
  if (sortBy === 'price_asc') displayedData.sort((a: any, b: any) => a.price - b.price);
  if (sortBy === 'price_desc') displayedData.sort((a: any, b: any) => b.price - a.price);
  if (sortBy === 'rating_desc') displayedData.sort((a: any, b: any) => b.rating - a.rating);

  const handleAddItinerary = (item: any) => {
    if (itinerary?.find((i: any) => i.id === item.id)) {
      message.warning('Điểm đến này đã có trong lịch trình!');
      return;
    }
    setItinerary([...(itinerary || []), { ...item, day: 1 }]); // Mặc định gán vào Ngày 1
    message.success(`Đã thêm ${item.name} vào lịch trình`);
  };

  return (
    <div style={{ padding: '16px 0' }}>
      <Space style={{ marginBottom: 24, flexWrap: 'wrap' }}>
        <Select value={filterType} style={{ width: 160 }} onChange={setFilterType}
          options={[
            { label: 'Tất cả địa hình', value: 'all' }, 
            { label: 'Du lịch Biển', value: 'beach' }, 
            { label: 'Du lịch Núi', value: 'mountain' }, 
            { label: 'Thành phố', value: 'city' }
          ]}
        />
        <Select value={sortBy} style={{ width: 180 }} onChange={setSortBy}
          options={[
            { label: 'Sắp xếp mặc định', value: 'none' }, 
            { label: 'Giá tăng dần', value: 'price_asc' }, 
            { label: 'Giá giảm dần', value: 'price_desc' },
            { label: 'Đánh giá cao nhất', value: 'rating_desc' }
          ]}
        />
      </Space>

      <Row gutter={[16, 24]}>
        {displayedData.length > 0 ? displayedData.map((item: any) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              hoverable
              cover={<img alt={item.name} src={item.image} style={{ height: 200, objectFit: 'cover' }} />}
              actions={[
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddItinerary(item)}>
                  Thêm vào lịch trình
                </Button>
              ]}
            >
              <Card.Meta 
                title={<Title level={5} style={{ margin: 0 }}>{item.name}</Title>} 
                description={
                  <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                    <Text type="secondary"><EnvironmentOutlined /> {item.location || 'Chưa cập nhật'}</Text>
                    <Space>
                      <Tag color={item.type === 'beach' ? 'blue' : item.type === 'mountain' ? 'green' : 'orange'}>
                        {item.type === 'beach' ? 'Biển' : item.type === 'mountain' ? 'Núi' : 'Thành phố'}
                      </Tag>
                      <Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} allowHalf />
                    </Space>
                    <Text strong style={{ color: '#f5222d', fontSize: 16 }}>{item.price?.toLocaleString()} VNĐ</Text>
                  </Space>
                } 
              />
            </Card>
          </Col>
        )) : <Empty description="Không có điểm đến nào phù hợp" style={{ width: '100%', margin: '40px 0' }} />}
      </Row>
    </div>
  );
};

export default Explore;