import React from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Popconfirm, Tag, Space, Typography, Tooltip, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormSelect, ProFormDatePicker } from '@ant-design/pro-form';

const { Text } = Typography;

interface Task {
	id: string;
	title: string;
	assignee: string;
	priority: 'High' | 'Medium' | 'Low';
	status: 'Todo' | 'Doing' | 'Done';
	deadline: string;
}
interface Props {
	tasks: Task[];
	setTasks: (tasks: Task[]) => void;
	allUsers: { username: string }[];
}

const TaskList: React.FC<Props> = ({ tasks, setTasks, allUsers }) => {
	// Hàm lưu dữ liệu (Thêm mới/Cập nhật)
	const handleSave = async (values: any, id?: string) => {
		if (id) {
			setTasks(tasks.map((t) => (t.id === id ? { ...t, ...values } : t)));
		} else {
			const newTask = { ...values, id: Date.now().toString() };
			setTasks([...tasks, newTask]);
		}
		return true;
	};

	// Cấu hình các cột của ProTable
	const columns: ProColumns<Task>[] = [
		{
			title: 'Tên công việc',
			dataIndex: 'title',
			copyable: true,
			ellipsis: true,
			formItemProps: {
				rules: [{ required: true, message: 'Vui lòng nhập tên công việc' }],
			},
			render: (dom) => <Text strong>{dom}</Text>,
		},
		{
			title: 'Người thực hiện',
			dataIndex: 'assignee',
			valueType: 'select',
			// Tự động tạo danh sách lọc từ allUsers
			valueEnum: allUsers.reduce(
				(acc, user) => ({
					...acc,
					[user.username]: { text: user.username },
				}),
				{},
			),
		},
		{
			title: 'Ưu tiên',
			dataIndex: 'priority',
			render: (_, record) => {
				// 1. Định nghĩa bảng màu
				const colors = { High: 'red', Medium: 'gold', Low: 'blue' };

				// 2. Ép kiểu để tránh lỗi TypeScript và lấy màu mặc định nếu priority bị undefined
				const tagColor = colors[record.priority as keyof typeof colors] || 'default';

				return (
					<Tag color={tagColor} style={{ borderRadius: 4 }}>
						{record.priority?.toUpperCase() || 'KHÔNG XÁC ĐỊNH'}
					</Tag>
				);
			},
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			initialValue: 'Todo',
			valueEnum: {
				Todo: { text: 'Chưa làm', status: 'Default' },
				Doing: { text: 'Đang làm', status: 'Processing' },
				Done: { text: 'Đã xong', status: 'Success' },
			},
		},
		{
			title: 'Hạn chót',
			dataIndex: 'deadline',
			valueType: 'date',
			sorter: (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
		},
		{
			title: 'Thao tác',
			valueType: 'option',
			key: 'option',
			render: (_, record) => [
				<ModalForm
					key='edit'
					title='Chỉnh sửa công việc'
					trigger={
						<Tooltip title='Chỉnh sửa'>
							<Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />} />
						</Tooltip>
					}
					initialValues={record}
					onFinish={(values) => handleSave(values, record.id)}
					modalProps={{ destroyOnClose: true }}
				>
					<TaskFields allUsers={allUsers} />
				</ModalForm>,
				<Popconfirm
					key='delete'
					title='Xác nhận xóa nhiệm vụ?'
					icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
					onConfirm={() => setTasks(tasks.filter((t) => t.id !== record.id))}
					okText='Xóa'
					cancelText='Hủy'
				>
					<Tooltip title='Xóa'>
						<Button type='text' danger icon={<DeleteOutlined />} />
					</Tooltip>
				</Popconfirm>,
			],
		},
	];

	return (
		<div style={{ background: '#fff', borderRadius: 12, padding: 16 }}>
			<ProTable<Task>
				columns={columns}
				dataSource={tasks}
				rowKey='id'
				pagination={{ pageSize: 8 }}
				search={{
					labelWidth: 'auto',
					filterType: 'query',
				}}
				options={{
					density: true,
					fullScreen: true,
					setting: true,
					reload: true,
				}}
				headerTitle={
					<Space>
						<SearchOutlined style={{ color: '#1890ff' }} />
						<Text strong>Hệ thống nhiệm vụ</Text>
					</Space>
				}
				toolBarRender={() => [
					<ModalForm
						key='create'
						title='Tạo nhiệm vụ mới'
						trigger={
							<Button
								type='primary'
								icon={<PlusOutlined />}
								size='large'
								style={{ borderRadius: 8, boxShadow: '0 4px 10px rgba(24,144,255,0.2)' }}
							>
								Thêm mới
							</Button>
						}
						onFinish={handleSave}
						modalProps={{ destroyOnClose: true }}
					>
						<TaskFields allUsers={allUsers} />
					</ModalForm>,
				]}
			/>
		</div>
	);
};

// Form nhập liệu dùng chung cho Thêm/Sửa
const TaskFields = ({ allUsers }: { allUsers: any[] }) => (
	<div style={{ paddingTop: 12 }}>
		<ProFormText
			name='title'
			label='Tên nhiệm vụ'
			placeholder='Nhập nội dung công việc...'
			rules={[{ required: true }]}
		/>
		<ProFormSelect
			name='assignee'
			label='Người thực hiện'
			options={allUsers.map((u) => ({ label: u.username, value: u.username }))}
			rules={[{ required: true }]}
		/>
		<Row gutter={16}>
			<Col span={12}>
				<ProFormSelect
					name='priority'
					label='Độ ưu tiên'
					options={[
						{ label: 'Cao', value: 'High' },
						{ label: 'Trung bình', value: 'Medium' },
						{ label: 'Thấp', value: 'Low' },
					]}
					initialValue='Medium'
				/>
			</Col>
			<Col span={12}>
				<ProFormSelect
					name='status'
					label='Trạng thái'
					options={[
						{ label: 'Chưa làm', value: 'Todo' },
						{ label: 'Đang làm', value: 'Doing' },
						{ label: 'Đã xong', value: 'Done' },
					]}
					initialValue='Todo'
				/>
			</Col>
		</Row>
		<ProFormDatePicker name='deadline' label='Hạn chót' width='100%' rules={[{ required: true }]} />
	</div>
);

export default TaskList;
