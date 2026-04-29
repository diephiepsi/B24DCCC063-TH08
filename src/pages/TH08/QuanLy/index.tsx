import React, { useState, useEffect } from 'react';
import {
	Table,
	Tag,
	Space,
	Button,
	Input,
	Select,
	Card,
	Typography,
	Modal,
	Form,
	message,
	Popconfirm,
	Tooltip,
	Avatar,
	Row,
	Col,
} from 'antd';
import {
	PlusOutlined,
	SearchOutlined,
	EditOutlined,
	DeleteOutlined,
	EyeOutlined,
	GlobalOutlined,
	RocketOutlined,
	CheckCircleOutlined,
	FormOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PostManagement: React.FC = () => {
	const [form] = Form.useForm();

	const [baiViets, setBaiViets] = useState<any[]>(() => {
		const saved = localStorage.getItem('th08_posts');
		return saved ? JSON.parse(saved) : [];
	});

	const [danhSachTags] = useState<string[]>(['React', 'TH08', 'TypeScript', 'Frontend', 'UmiJS']);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<string | null>(null);

	useEffect(() => {
		localStorage.setItem('th08_posts', JSON.stringify(baiViets));
	}, [baiViets]);

	const showModal = (record?: any) => {
		if (record) {
			setEditingId(record.id);
			form.setFieldsValue(record);
		} else {
			setEditingId(null);
			form.resetFields();
		}
		setIsModalVisible(true);
	};

	const handleSave = (values: any) => {
		if (editingId) {
			const updatedData = baiViets.map((item) => (item.id === editingId ? { ...item, ...values } : item));
			setBaiViets(updatedData);
			message.success('Cập nhật thành công');
		} else {
			const newPost = {
				...values,
				id: `bv-${Date.now()}`,
				luotXem: 0,
				ngayDang: new Date().toISOString().split('T')[0],
				tacGia: 'Nguyễn Văn Điệp',
			};
			setBaiViets([newPost, ...baiViets]);
			message.success('Đã thêm bài viết mới');
		}
		setIsModalVisible(false);
	};

	const handleDelete = (id: string) => {
		setBaiViets(baiViets.filter((item) => item.id !== id));
		message.error('Đã xóa dữ liệu');
	};

	const columns = [
		{
			title: 'BÀI VIẾT',
			key: 'article',
			width: '45%',
			render: (record: any) => (
				<Space size={16}>
					<Avatar
						shape='square'
						size={64}
						src={record.anhDaiDien}
						style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
					/>
					<div style={{ maxWidth: '350px' }}>
						<Text strong style={{ fontSize: '15px', color: '#111827', display: 'block' }}>
							{record.tieuDe}
						</Text>
						<Text type='secondary' style={{ fontSize: '12px' }}>
							<GlobalOutlined /> /{record.slug}
						</Text>
					</div>
				</Space>
			),
		},
		{
			title: 'TRẠNG THÁI',
			dataIndex: 'trangThai',
			key: 'trangThai',
			align: 'center' as const,
			render: (status: string) => (
				<Tag
					color={status === 'Published' ? 'success' : 'warning'}
					style={{ borderRadius: '6px', fontWeight: 600, padding: '2px 10px' }}
				>
					{status === 'Published' ? <CheckCircleOutlined /> : <FormOutlined />}{' '}
					{status === 'Published' ? 'ĐÃ ĐĂNG' : 'BẢN NHÁP'}
				</Tag>
			),
		},
		{
			title: 'CHỦ ĐỀ',
			dataIndex: 'tags',
			key: 'tags',
			render: (tags: string[]) => (
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
					{tags?.map((tag) => (
						<Tag key={tag} style={{ margin: 0, fontSize: '11px', background: '#f3f4f6', border: 'none' }}>
							{tag}
						</Tag>
					))}
				</div>
			),
		},
		{
			title: 'LƯỢT XEM',
			dataIndex: 'luotXem',
			key: 'luotXem',
			sorter: (a: any, b: any) => a.luotXem - b.luotXem,
			render: (val: number) => (
				<Text strong style={{ color: '#3b82f6' }}>
					<EyeOutlined /> {val.toLocaleString()}
				</Text>
			),
		},
		{
			title: 'THAO TÁC',
			key: 'action',
			align: 'right' as const,
			render: (record: any) => (
				<Space>
					<Tooltip title='Chỉnh sửa'>
						<Button
							type='primary'
							shape='circle'
							icon={<EditOutlined />}
							onClick={() => showModal(record)}
							style={{ background: '#3b82f6' }}
						/>
					</Tooltip>
					<Popconfirm
						title='Xác nhận xóa bài viết này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
						okButtonProps={{ danger: true }}
					>
						<Button type='primary' danger shape='circle' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	const filteredData = baiViets.filter((item) => {
		const matchSearch = item.tieuDe.toLowerCase().includes(searchText.toLowerCase());
		const matchStatus = filterStatus ? item.trangThai === filterStatus : true;
		return matchSearch && matchStatus;
	});

	return (
		<div style={{ padding: '30px', background: '#f8fafc', minHeight: '100vh' }}>
			<Card bordered={false} style={{ borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
				<Row justify='space-between' align='middle' style={{ marginBottom: '30px' }}>
					<Col>
						<Title level={2} style={{ margin: 0, fontWeight: 800 }}>
							Quản Lý Bài Viết
						</Title>
						<Text type='secondary'>Quản lý nội dung Blog của bạn tại đây</Text>
					</Col>
					<Col>
						<Button
							type='primary'
							size='large'
							icon={<PlusOutlined />}
							onClick={() => showModal()}
							style={{
								borderRadius: '12px',
								height: '50px',
								fontWeight: 600,
								background: '#10b981',
								border: 'none',
								boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
							}}
						>
							THÊM BÀI VIẾT
						</Button>
					</Col>
				</Row>

				<Space style={{ marginBottom: '24px' }} size='middle'>
					<Input
						placeholder='Tìm theo tiêu đề...'
						prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
						style={{ width: 350, borderRadius: '10px' }}
						size='large'
						onChange={(e) => setSearchText(e.target.value)}
						allowClear
					/>
					<Select
						placeholder='Lọc trạng thái'
						style={{ width: 180 }}
						size='large'
						allowClear
						onChange={(val) => setFilterStatus(val)}
					>
						<Select.Option value='Published'>Đã đăng</Select.Option>
						<Select.Option value='Draft'>Bản nháp</Select.Option>
					</Select>
				</Space>

				<Table
					columns={columns}
					dataSource={filteredData}
					rowKey='id'
					pagination={{ pageSize: 6 }}
					style={{ background: '#fff' }}
				/>
			</Card>

			<Modal
				title={
					<Title level={4} style={{ margin: 0 }}>
						<RocketOutlined /> Soạn Thảo Nội Dung
					</Title>
				}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onOk={() => form.submit()}
				width={1000}
				centered
				okText='LƯU BÀI VIẾT'
				cancelText='HỦY'
			>
				<Form form={form} layout='vertical' style={{ marginTop: '20px' }}>
					<Row gutter={24}>
						<Col span={16}>
							<Form.Item name='tieuDe' label={<b>Tiêu đề bài viết</b>} rules={[{ required: true }]}>
								<Input placeholder='Tiêu đề hấp dẫn...' size='large' />
							</Form.Item>
							<Form.Item name='tomTat' label={<b>Tóm tắt ngắn</b>} rules={[{ required: true }]}>
								<TextArea rows={3} placeholder='Mô tả ngắn gọn...' />
							</Form.Item>
							<Form.Item name='noiDung' label={<b>Nội dung (Markdown)</b>} rules={[{ required: true }]}>
								<TextArea rows={12} style={{ fontFamily: 'monospace', background: '#f9fafb' }} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='trangThai' label={<b>Trạng thái</b>} initialValue='Published'>
								<Select size='large'>
									<Select.Option value='Published'>Công khai</Select.Option>
									<Select.Option value='Draft'>Bản nháp</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item name='tags' label={<b>Thẻ (Tags)</b>}>
								<Select mode='tags' placeholder='Gõ tag và Enter' size='large'>
									{danhSachTags.map((t) => (
										<Select.Option key={t} value={t}>
											{t}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item name='slug' label={<b>Slug URL</b>} rules={[{ required: true }]}>
								<Input prefix='/' placeholder='duong-dan' />
							</Form.Item>
							<Form.Item name='anhDaiDien' label={<b>URL Ảnh đại diện</b>} rules={[{ required: true }]}>
								<Input placeholder='https://...' />
							</Form.Item>
							<div style={{ marginTop: '16px', padding: '12px', background: '#f3f4f6', borderRadius: '12px' }}>
								<Text type='secondary' style={{ fontSize: '11px', display: 'block', marginBottom: '8px' }}>
									XEM TRƯỚC ẢNH
								</Text>
								<Form.Item shouldUpdate={(prev, curr) => prev.anhDaiDien !== curr.anhDaiDien} noStyle>
									{({ getFieldValue }) => (
										<img
											src={getFieldValue('anhDaiDien') || 'https://via.placeholder.com/200x120?text=No+Image'}
											alt='Preview'
											style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
										/>
									)}
								</Form.Item>
							</div>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

export default PostManagement;
