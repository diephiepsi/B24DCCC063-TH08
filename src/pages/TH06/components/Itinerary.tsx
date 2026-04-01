dimport { Table, Button, Space, Typography, Popconfirm, Card, Tag, Alert } from 'antd';
import { DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Itinerary = (props: any) => {
  const { itinerary, setItinerary } = props;

  const moveItem = (index: number, direction: number) => {
    const newItinerary = [...itinerary];
    const temp = newItinerary[index];
    newItinerary[index] = newItinerary[index + direction];
    newItinerary[index + direction] = temp;
    setItinerary(newItinerary);
  };

  const removeItem = (id: string) => setItinerary(itinerary.filter((i: any) => i.id !== id));

  // Giả lập thời gian di chuyển giữa 2 điểm liên tiếp là 1.5 giờ
  const calculateTransferTime = (index: number) => {
    if (index === 0) return 0;
    return 1.5; 
  };

  const columns = [
    { 
      title: 'Lịch trình', 
      render: (_: any, __: any, index: number) => <Tag color="blue">Ngày {index + 1}</Tag> 
    },
    { 
      title: 'Điểm đến', 
      dataIndex: 'name',
      render: (text: string, record: any, index: number) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          {index > 0 && <Text type="secondary" style={{ fontSize: 12 }}><ClockCircleOutlined /> Di chuyển từ điểm trước: {calculateTransferTime(index)}h</Text>}
        </Space>
      )
    },
    { title: 'Tham quan (h)', dataIndex: 'time', align: 'center' as const },
    { 
      title: 'Chi phí dự kiến', 
      render: (r: any) => <Text strong style={{ color: '#fa8c16' }}>{(r.foodCost + r.stayCost + r.moveCost)?.toLocaleString()} đ</Text> 
    },
    {
      title: 'Sắp xếp',
      align: 'center' as const,
      render: (_: any, __: any, index: number) => (
        <Space>
          <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => moveItem(index, -1)} />
          <Button size="small" icon={<ArrowDownOutlined />} disabled={index === itinerary?.length - 1} onClick={() => moveItem(index, 1)} />
        </Space>
      )
    },
    {
      title: 'Thao tác',
      align: 'center' as const,
      render: (_: any, r: any) => (
        <Popconfirm title="Xóa điểm này khỏi lịch trình?" onConfirm={() => removeItem(r.id)}>
          <Button danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  const totalTime = itinerary?.reduce((sum: number, item: any) => sum + (item.time || 0), 0) + (itinerary?.length > 1 ? (itinerary.length - 1) * 1.5 : 0);
  const totalCost = itinerary?.reduce((sum: number, item: any) => sum + (item.foodCost + item.stayCost + item.moveCost), 0);

  return (
    <Card bordered={false}>
      <Title level={4}>Lịch trình chuyến đi</Title>
      {(!itinerary || itinerary.length === 0) ? (
        <Alert message="Chưa có lịch trình" description="Vui lòng sang tab Khám phá để chọn điểm đến." type="info" showIcon />
      ) : (
        <>
          <Table dataSource={itinerary} columns={columns} rowKey="id" pagination={false} bordered />
          <div style={{ marginTop: 20, padding: 16, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4 }}>
            <Space size="large">
              <Text strong>Tổng thời gian (Gồm di chuyển): <Text type="danger">{totalTime} giờ</Text></Text>
              <Text strong>Tổng chi phí ước tính: <Text type="danger">{totalCost?.toLocaleString()} VNĐ</Text></Text>
            </Space>
          </div>
        </>
      )}
    </Card>
  );
};

export default Itinerary;