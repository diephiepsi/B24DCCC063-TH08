import React from 'react';
import { List, Card, Tag, Statistic, Row, Col, Progress, Typography, Empty, Avatar, Space } from 'antd';
import {
	CheckCircleOutlined,
	SyncOutlined,
	ClockCircleOutlined,
	ProjectOutlined,
	FireOutlined,
	UserOutlined,
	DashboardOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface Task {
	id: string;
	title: string;
	assignee: string;
	priority: 'Low' | 'Medium' | 'High';
	status: 'Todo' | 'Doing' | 'Done';
	deadline: string;
}

interface Props {
	tasks: Task[];
	currentUser: string;
}

const AssignmentView: React.FC<Props> = ({ tasks, currentUser }) => {
	const myTasks = tasks.filter((t) => t.assignee === currentUser);
	const total = myTasks.length;
	const done = myTasks.filter((t) => t.status === 'Done').length;
	const doing = myTasks.filter((t) => t.status === 'Doing').length;
	const percent = total > 0 ? Math.round((done / total) * 100) : 0;

	const getPriorityTag = (priority: string) => {
		const config = {
			High: { color: '#ff4d4f', label: 'Khẩn cấp', icon: <FireOutlined /> },
			Medium: { color: '#faad14', label: 'Trung bình', icon: <FireOutlined /> },
			Low: { color: '#2db7f5', label: 'Thấp', icon: <FireOutlined /> },
		};
		const p = config[priority as keyof typeof config] || config.Low;
		return (
			<Tag icon={p.icon} color={p.color}>
				{p.label}
			</Tag>
		);
	};

	const getStatusTag = (status: string) => {
		if (status === 'Done')
			return (
				<Tag icon={<CheckCircleOutlined />} color='success'>
					Đã xong
				</Tag>
			);
		if (status === 'Doing')
			return (
				<Tag icon={<SyncOutlined spin />} color='processing'>
					Đang làm
				</Tag>
			);
		return (
			<Tag icon={<ClockCircleOutlined />} color='default'>
				Chưa làm
			</Tag>
		);
	};

	return (
		<div style={{ padding: '0px' }}>
			<div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Space size='middle'>
					<Avatar
						size={54}
						icon={<UserOutlined />}
						style={{ backgroundColor: '#1890ff', boxShadow: '0 4px 10px rgba(24,144,255,0.3)' }}
					/>
					<div>
						<Title level={3} style={{ margin: 0 }}>
							Chào buổi làm việc, {currentUser}!
						</Title>
						<Text type='secondary'>Bạn có {total - done} nhiệm vụ cần hoàn thành hôm nay.</Text>
					</div>
				</Space>
			</div>

			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={8}>
					<Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
						<Statistic title='Việc được giao' value={total} prefix={<ProjectOutlined style={{ color: '#1890ff' }} />} />
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
						<Statistic
							title='Đang thực hiện'
							value={doing}
							valueStyle={{ color: '#faad14' }}
							prefix={<SyncOutlined />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
						<div style={{ marginBottom: 8 }}>
							<Text type='secondary'>Hiệu suất hoàn thành</Text>
						</div>
						<Progress
							percent={percent}
							strokeColor={{ '0%': '#108ee9', '100%': '#52c41a' }}
							status='active'
							strokeWidth={10}
						/>
					</Card>
				</Col>
			</Row>

			<Card
				title={
					<Space>
						<DashboardOutlined /> Danh sách nhiệm vụ của tôi
					</Space>
				}
				bordered={false}
				style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
				bodyStyle={{ padding: '0 24px' }}
			>
				{myTasks.length > 0 ? (
					<List
						itemLayout='horizontal'
						dataSource={myTasks}
						renderItem={(item) => (
							<List.Item
								style={{ padding: '20px 0' }}
								actions={[
									<Text type='secondary' style={{ fontWeight: 500 }}>
										<ClockCircleOutlined /> {item.deadline}
									</Text>,
								]}
							>
								<List.Item.Meta
									title={
										<Space size='middle'>
											<Text
												strong
												style={{
													fontSize: 16,
													textDecoration: item.status === 'Done' ? 'line-through' : 'none',
													color: item.status === 'Done' ? '#bfbfbf' : '#262626',
												}}
											>
												{item.title}
											</Text>
											{getPriorityTag(item.priority)}
										</Space>
									}
									description={<div style={{ marginTop: 6 }}>{getStatusTag(item.status)}</div>}
								/>
							</List.Item>
						)}
					/>
				) : (
					<div style={{ padding: '40px 0' }}>
						<Empty description='Tuyệt vời! Bạn không còn công việc nào tồn đọng.' />
					</div>
				)}
			</Card>
		</div>
	);
};

export default AssignmentView;
