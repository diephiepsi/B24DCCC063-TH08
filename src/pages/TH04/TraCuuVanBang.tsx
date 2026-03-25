import { useState } from 'react';
import { Card, Form, Input, Button, Row, Col, message, Descriptions, Divider, Empty, Space, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const TraCuuVanBang = (props: any) => {
  const { diplomas, decisions, setDecisions } = props;
  const [form] = Form.useForm();
  const [result, setResult] = useState<any>(null);

  const handleSearch = (values: any) => {
    const cleanValues: any = {};
    Object.keys(values).forEach((key) => {
      const val = values[key];
      if (typeof val === 'string') {
        cleanValues[key] = val.trim(); 
      } else {
        cleanValues[key] = val;
      }
    });

    const filledParams = Object.values(cleanValues).filter((v) => v !== undefined && v !== '').length;

    if (filledParams < 2) {
      message.warning('Yêu cầu nhập ít nhất 2 tham số để tra cứu!');
      return;
    }

    const found = diplomas.find((item: any) => {
      return (
        (cleanValues.soHieuVB && item.soHieuVB === cleanValues.soHieuVB) ||
        (cleanValues.soVaoSo && item.soVaoSo.toString() === cleanValues.soVaoSo) ||
        (cleanValues.maSV && item.maSV === cleanValues.maSV) ||
        (cleanValues.hoTen && item.hoTen.toLowerCase().includes(cleanValues.hoTen.toLowerCase())) ||
        (cleanValues.ngaySinh && item.ngaySinh === cleanValues.ngaySinh)
      );
    });

    if (found) {
      setResult(found);
      message.success('Tìm thấy thông tin văn bằng!');

      const newDecisions = decisions.map((qd: any) => {
        if (qd.id === found.quyetDinhId) {
          return { ...qd, luotTraCuu: (qd.luotTraCuu || 0) + 1 };
        }
        return qd;
      });
      setDecisions(newDecisions);
    } else {
      setResult(null);
      message.error('Không tìm thấy văn bằng phù hợp với thông tin đã nhập.');
    }
  };

  return (
    <Card title={<span><SearchOutlined /> Tra cứu thông tin văn bằng</span>}>
      <Form form={form} layout="vertical" onFinish={handleSearch}>
        <Row gutter={[16, 0]}>
          <Col span={8}><Form.Item name="soHieuVB" label="Số hiệu văn bằng"><Input placeholder="VD: VB123..." allowClear /></Form.Item></Col>
          <Col span={8}><Form.Item name="soVaoSo" label="Số vào sổ"><Input placeholder="Nhập số vào sổ..." allowClear /></Form.Item></Col>
          <Col span={8}><Form.Item name="maSV" label="Mã sinh viên (MSV)"><Input placeholder="VD: B24DCCC..." allowClear /></Form.Item></Col>
          <Col span={8}><Form.Item name="hoTen" label="Họ và tên"><Input placeholder="Nhập tên sinh viên..." allowClear /></Form.Item></Col>
          <Col span={8}><Form.Item name="ngaySinh" label="Ngày sinh"><Input placeholder="YYYY-MM-DD" allowClear /></Form.Item></Col>
        </Row>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm kiếm</Button>
          <Button icon={<ReloadOutlined />} onClick={() => { form.resetFields(); setResult(null); }}>Làm mới</Button>
        </Space>
      </Form>

      <Divider />

      {result ? (
        <div className="animate__animated animate__fadeIn">
          <Descriptions title="Chi tiết văn bằng" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Họ và tên" labelStyle={{ fontWeight: 'bold' }}>{result.hoTen}</Descriptions.Item>
            <Descriptions.Item label="Mã sinh viên">{result.maSV}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{result.ngaySinh}</Descriptions.Item>
            <Descriptions.Item label="Số hiệu văn bằng"><Tag color="blue">{result.soHieuVB}</Tag></Descriptions.Item>
            <Descriptions.Item label="Số vào sổ">{result.soVaoSo}</Descriptions.Item>
            <Descriptions.Item label="Quyết định tốt nghiệp">
              {decisions.find((d: any) => d.id === result.quyetDinhId)?.soQD || 'N/A'}
            </Descriptions.Item>
            {}
            {Object.keys(result.duLieuDong || {}).map((key) => (
              <Descriptions.Item key={key} label={key}>{result.duLieuDong[key]}</Descriptions.Item>
            ))}
          </Descriptions>
        </div>
      ) : (
        <Empty description="Nhập ít nhất 2 tham số để bắt đầu tra cứu" />
      )}
    </Card>
  );
};

export default TraCuuVanBang;