import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Rate,
  Tag,
  Select,
  Space,
  Empty,
  Button,
  Typography,
  message,
  Modal,
  Divider,
} from 'antd';
import { EnvironmentOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Explore = (props: any) => {
  const { destinations, itinerary, setItinerary } = props;

  // States cho filter và sort
  const [filterType, setFilterType] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('none');

  // States cho modal chi tiết
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Logic lọc và sắp xếp
  let displayedData = destinations?.filter((d: any) => {
    const matchType = filterType === 'all' || d.type === filterType;

    // Lọc theo giá
    let matchPrice = true;
    if (priceFilter === 'under1m') matchPrice = d.price < 1000000;
    else if (priceFilter === '1m-3m') matchPrice = d.price >= 1000000 && d.price <= 3000000;
    else if (priceFilter === '3m-5m') matchPrice = d.price >= 3000000 && d.price <= 5000000;
    else if (priceFilter === 'over5m') matchPrice = d.price > 5000000;

    return matchType && matchPrice;
  }) || [];

  // Sắp xếp
  if (sortBy === 'price_asc') displayedData.sort((a: any, b: any) => a.price - b.price);
  if (sortBy === 'price_desc') displayedData.sort((a: any, b: any) => b.price - a.price);
  if (sortBy === 'rating_desc') displayedData.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));

  const handleAddItinerary = (item: any) => {
    if (itinerary?.find((i: any) => i.id === item.id)) {
      message.warning('Điểm đến này đã có trong lịch trình!');
      return;
    }
    setItinerary([...(itinerary || []), { ...item, day: 1 }]);
    message.success(`Đã thêm ${item.name} vào lịch trình`);
  };

  const showDetail = (item: any) => {
    setSelectedDestination(item);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '16px 0' }}>
      {/* Tiêu đề theo yêu cầu */}
      <Title level={2} style={{ marginBottom: 24 }}>
       Trang chủ - Khám phá điểm đến
      </Title>

      {/* Bộ lọc */}
      <Space style={{ marginBottom: 24, flexWrap: 'wrap' }} size="middle">
        <Select
          value={filterType}
          style={{ width: 170 }}
          onChange={setFilterType}
          options={[
            { label: 'Tất cả địa hình', value: 'all' },
            { label: 'Du lịch Biển', value: 'beach' },
            { label: 'Du lịch Núi', value: 'mountain' },
            { label: 'Thành phố', value: 'city' },
          ]}
        />

        <Select
          value={priceFilter}
          style={{ width: 180 }}
          onChange={setPriceFilter}
          options={[
            { label: 'Tất cả giá', value: 'all' },
            { label: 'Dưới 1 triệu', value: 'under1m' },
            { label: '1 - 3 triệu', value: '1m-3m' },
            { label: '3 - 5 triệu', value: '3m-5m' },
            { label: 'Trên 5 triệu', value: 'over5m' },
          ]}
        />

        <Select
          value={sortBy}
          style={{ width: 180 }}
          onChange={setSortBy}
          options={[
            { label: 'Sắp xếp mặc định', value: 'none' },
            { label: 'Giá tăng dần', value: 'price_asc' },
            { label: 'Giá giảm dần', value: 'price_desc' },
            { label: 'Đánh giá cao nhất', value: 'rating_desc' },
          ]}
        />
      </Space>

      <Row gutter={[16, 24]}>
        {displayedData.length > 0 ? (
          displayedData.map((item: any) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                hoverable
                style={{ cursor: 'pointer', height: '100%' }}
                cover={
                  <img
                    alt={item.name}
                    src={item.image}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
                onClick={() => showDetail(item)}
                actions={[
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddItinerary(item);
                    }}
                  >
                    Thêm vào lịch trình
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={<Title level={5} style={{ margin: 0 }}>{item.name}</Title>}
                  description={
                    <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                      <Text type="secondary">
                        <EnvironmentOutlined /> {item.location || 'Chưa cập nhật'}
                      </Text>
                      <Space>
                        <Tag
                          color={
                            item.type === 'beach'
                              ? 'blue'
                              : item.type === 'mountain'
                              ? 'green'
                              : 'orange'
                          }
                        >
                          {item.type === 'beach' ? 'Biển' : item.type === 'mountain' ? 'Núi' : 'Thành phố'}
                        </Tag>
                        <Rate
                          disabled
                          defaultValue={item.rating || 0}
                          style={{ fontSize: 12 }}
                          allowHalf
                        />
                      </Space>
                      <Text strong style={{ color: '#f5222d', fontSize: 16 }}>
                        {item.price?.toLocaleString()} VNĐ
                      </Text>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))
        ) : (
          <Empty
            description="Không có điểm đến nào phù hợp với bộ lọc"
            style={{ width: '100%', margin: '60px 0' }}
          />
        )}
      </Row>

      {/* Modal Chi tiết điểm đến */}
      <Modal
        title={selectedDestination?.name || 'Chi tiết điểm đến'}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={720}
        centered
      >
        {selectedDestination && (
          <>
            <img
              src={selectedDestination.image}
              alt={selectedDestination.name}
              style={{
                width: '100%',
                height: '320px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            />

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                <EnvironmentOutlined /> {selectedDestination.location || 'Chưa cập nhật'}
              </Text>

              <Space>
                <Tag
                  color={
                    selectedDestination.type === 'beach'
                      ? 'blue'
                      : selectedDestination.type === 'mountain'
                      ? 'green'
                      : 'orange'
                  }
                >
                  {selectedDestination.type === 'beach'
                    ? 'Du lịch Biển'
                    : selectedDestination.type === 'mountain'
                    ? 'Du lịch Núi'
                    : 'Thành phố'}
                </Tag>
                <Rate disabled defaultValue={selectedDestination.rating || 0} allowHalf />
                <Text type="secondary">({selectedDestination.rating || 0}/5)</Text>
              </Space>

              <Divider />

              <div>
                <Title level={5}>Giá tham khảo</Title>
                <Text strong style={{ fontSize: '20px', color: '#f5222d' }}>
                  {selectedDestination.price?.toLocaleString()} VNĐ
                </Text>
              </div>

              {selectedDestination.description && (
                <>
                  <Divider />
                  <div>
                    <Title level={5}>Mô tả</Title>
                    <Paragraph style={{ fontSize: '15px', lineHeight: '1.7' }}>
                      {selectedDestination.description}
                    </Paragraph>
                  </div>
                </>
              )}

              <div style={{ textAlign: 'right', marginTop: '24px' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    handleAddItinerary(selectedDestination);
                    setIsModalOpen(false);
                  }}
                >
                  Thêm vào lịch trình
                </Button>
              </div>
            </Space>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Explore;