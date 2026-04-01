import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';

const CauHinhBieuMau = ({ fields, setFields }: any) => {
  // Hàm xử lý thêm hoặc sửa
  const handleSave = async (values: any, id?: string) => {
    if (id) {
      // Logic Sửa
      setFields(fields.map((f: any) => (f.id === id ? { ...values, id } : f)));
      message.success('Cập nhật thành công');
    } else {
      // Check trùng tên
      if (fields.some((f: any) => f.tenTruong === values.tenTruong)) {
        message.error('Tên trường này đã tồn tại!');
        return false;
      }
      // Logic Thêm
      setFields([...fields, { ...values, id: Date.now().toString() }]);
      message.success('Thêm thành công');
    }
    return true;
  };

  const columns: any[] = [
    { title: 'Tên trường thông tin', dataIndex: 'tenTruong', copyable: true },
    { 
      title: 'Kiểu dữ liệu', 
      dataIndex: 'kieuDuLieu',
      render: (text: string) => <code style={{ color: '#eb2f96' }}>{text}</code>
    },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <Space>
          {/* Nút Sửa */}
          <ModalForm
            title="Chỉnh sửa trường thông tin"
            trigger={<a><EditOutlined /> Sửa</a>}
            initialValues={record} // Đưa dữ liệu cũ vào form
            onFinish={(v) => handleSave(v, record.id)}
          >
            <ProFormText name="tenTruong" label="Tên trường" rules={[{ required: true }]} />
            <ProFormSelect 
              name="kieuDuLieu" 
              label="Kiểu dữ liệu" 
              options={['String', 'Number', 'Date'].map(i => ({ label: i, value: i }))} 
            />
          </ModalForm>

          {/* Nút Xóa */}
          <Popconfirm title="Xóa trường này?" onConfirm={() => setFields(fields.filter((f: any) => f.id !== record.id))}>
            <a style={{ color: 'red' }}>Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ProTable
      headerTitle="Cấu hình biểu mẫu phụ lục"
      dataSource={fields}
      rowKey="id"
      search={false}
      toolBarRender={() => [
        <ModalForm
          title="Thêm trường thông tin"
          trigger={<Button type="primary" icon={<PlusOutlined />}>Thêm trường</Button>}
          onFinish={(v) => handleSave(v)}
        >
          <ProFormText name="tenTruong" label="Tên trường (VD: Nơi sinh, Dân tộc)" rules={[{ required: true }]} />
          <ProFormSelect 
            name="kieuDuLieu" 
            label="Kiểu dữ liệu" 
            options={['String', 'Number', 'Date'].map(i => ({ label: i, value: i }))} 
            rules={[{ required: true }]} 
          />
        </ModalForm>
      ]}
      columns={columns}
    />
  );
};

export default CauHinhBieuMau;