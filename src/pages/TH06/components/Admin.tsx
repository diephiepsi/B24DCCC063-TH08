/* eslint-disable @typescript-eslint/no-use-before-define */
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect, ProFormDigit, ProFormTextArea } from '@ant-design/pro-form';
import { Button, message, Popconfirm, Image, Card, Row, Col, Statistic, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BarChartOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Admin = (props: any) => {
  const { destinations, setDestinations } = props;

  const handleSave = async (values: any, id?: string) => {
    // Giá tổng tự động tính bằng tổng 3 loại chi phí theo chuẩn logic
    const calculatedPrice = (values.foodCost || 0) + (values.stayCost || 0) + (values.moveCost || 0);
    const finalValues = { ...values, price: calculatedPrice };

    if (id) {
      setDestinations(destinations.map((d: any) => d.id === id ? { ...finalValues, id } : d));
      message.success('Cập nhật thành công');
    } else {
      setDestinations([{ ...finalValues, id: Date.now().toString() }, ...destinations]);
      message.success('Thêm mới thành công');
    }
    return true;
  };

  const columns: any[] = [
    { title: 'Hình ảnh', dataIndex: 'image', search: false, render: (url: any) => <Image src={url} width={60} height={40} style={{ objectFit: 'cover' }} /> },
    { title: 'Tên địa điểm', dataIndex: 'name' },
    { title: 'Phân loại', dataIndex: 'type', valueEnum: { beach: { text: 'Biển' }, mountain: { text: 'Núi' }, city: { text: 'Thành phố' } } },
    { title: 'Thời gian (h)', dataIndex: 'time', search: false, align: 'center' },
    { title: 'Đánh giá', dataIndex: 'rating', search: false, render: (v: any) => <Tag color="gold">{v} ⭐</Tag> },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 120,
      render: (_: any, record: any) => [
        <ModalForm key="edit" title="Sửa điểm đến" trigger={<Button type="link" icon={<EditOutlined />} />} initialValues={record} onFinish={(v) => handleSave(v, record.id)} width={600}>
          <DestinationForm />
        </ModalForm>,
        <Popconfirm key="del" title="Xóa địa điểm này?" onConfirm={() => setDestinations(destinations.filter((d: any) => d.id !== record.id))}>
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ]
    }
  ];

  // Giả lập Dữ liệu Thống kê Admin dựa trên destinations hiện có
  const mockStats = {
    monthlyItineraries: 145,
    popularDest: destinations[0]?.name || 'Chưa có',
    totalRevenue: destinations.reduce((sum: number, d: any) => sum + (d.price || 0), 0) * 50, // Giả sử bán được 50 lượt
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 20 }}><BarChartOutlined /> Thống kê & Báo cáo hệ thống</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
        <Col xs={24} sm={8}><Card bordered={false}><Statistic title="Lịch trình tạo trong tháng" value={mockStats.monthlyItineraries} suffix="lượt" valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col xs={24} sm={8}><Card bordered={false}><Statistic title="Địa điểm phổ biến nhất" value={mockStats.popularDest} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col xs={24} sm={8}><Card bordered={false}><Statistic title="Tổng doanh thu ước tính" value={mockStats.totalRevenue} suffix="VNĐ" valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <ProTable
        headerTitle="Quản lý Dữ liệu Điểm đến"
        columns={columns}
        dataSource={destinations}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <ModalForm key="add" title="Thêm Điểm đến" trigger={<Button type="primary" icon={<PlusOutlined />}>Thêm điểm đến</Button>} onFinish={handleSave} width={600}>
            <DestinationForm />
          </ModalForm>
        ]}
      />
    </div>
  );
};

// Form dùng chung tái sử dụng
const DestinationForm = () => (
  <>
    <ProFormText name="image" label="URL Hình ảnh (Upload)" rules={[{ required: true }]} placeholder="Nhập link ảnh..." />
    <ProFormText name="name" label="Tên địa điểm" rules={[{ required: true }]} />
    <ProFormText name="location" label="Địa chỉ cụ thể" />
    <ProFormSelect name="type" label="Loại hình" options={[{ label: 'Biển', value: 'beach' }, { label: 'Núi', value: 'mountain' }, { label: 'Thành phố', value: 'city' }]} rules={[{ required: true }]} />
    
    <div style={{ display: 'flex', gap: 16 }}>
      <ProFormDigit name="rating" label="Đánh giá (1-5)" min={1} max={5} width="sm" />
      <ProFormDigit name="time" label="Thời gian tham quan (h)" width="sm" rules={[{ required: true }]} />
    </div>

    <div style={{ background: '#f5f5f5', padding: '16px 16px 1px', borderRadius: 8, marginBottom: 24 }}>
      <Typography.Text strong style={{ display: 'block', marginBottom: 16 }}>Phân bổ chi phí (VNĐ)</Typography.Text>
      <div style={{ display: 'flex', gap: 16 }}>
        <ProFormDigit name="foodCost" label="Ăn uống" width="sm" rules={[{ required: true }]} />
        <ProFormDigit name="stayCost" label="Lưu trú" width="sm" rules={[{ required: true }]} />
        <ProFormDigit name="moveCost" label="Di chuyển" width="sm" rules={[{ required: true }]} />
      </div>
    </div>
    
    <ProFormTextArea name="description" label="Mô tả chi tiết" />
  </>
);

export default Admin;