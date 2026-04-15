import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, Tag, Typography, Tooltip, Badge, Space } from 'antd';
import { CalendarOutlined, InfoCircleOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';

const localizer = momentLocalizer(moment);

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
}

const TaskCalendar: React.FC<Props> = ({ tasks }) => {
	const events = tasks.map((t) => ({
		id: t.id,
		title: t.title,
		start: new Date(t.deadline),
		end: new Date(t.deadline),
		allDay: true,
		resource: {
			assignee: t.assignee,
			priority: t.priority,
			status: t.status,
		},
	}));

	const eventStyleGetter = (event: any) => {
		let backgroundColor = '#1890ff';

		if (event.resource.status === 'Done') {
			backgroundColor = '#52c41a';
		} else if (event.resource.priority === 'High') {
			backgroundColor = '#ff4d4f';
		} else if (event.resource.priority === 'Medium') {
			backgroundColor = '#faad14';
		}

		return {
			style: {
				backgroundColor,
				borderRadius: '8px',
				opacity: 0.9,
				color: 'white',
				border: 'none',
				display: 'block',
				boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
				padding: '2px',
			},
		};
	};

	const CustomEvent = ({ event }: any) => (
		<Tooltip
			title={
				<div style={{ padding: '4px' }}>
					<Text strong style={{ color: '#fff' }}>
						{event.title}
					</Text>
					<br />
					<Space>
						<UserOutlined /> {event.resource.assignee}
					</Space>
					<br />
					<Badge
						status={event.resource.status === 'Done' ? 'success' : 'warning'}
						text={<span style={{ color: '#fff' }}>{event.resource.status}</span>}
					/>
				</div>
			}
		>
			<div
				style={{
					padding: '0 4px',
					fontSize: '12px',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
				}}
			>
				{event.resource.status === 'Done' && <CheckCircleOutlined style={{ marginRight: 4 }} />}
				<span style={{ fontWeight: 600 }}>{event.resource.assignee}:</span> {event.title}
			</div>
		</Tooltip>
	);

	return (
		<Card
			bordered={false}
			style={{
				borderRadius: 16,
				boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
				background: '#fff',
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 24,
					flexWrap: 'wrap',
					gap: '10px',
				}}
			>
				<Title level={4} style={{ margin: 0 }}>
					<CalendarOutlined style={{ marginRight: 10, color: '#1890ff' }} />
					Lịch trình công việc hệ thống
				</Title>
				<Space wrap>
					<Badge color='#ff4d4f' text='Khẩn cấp' />
					<Badge color='#faad14' text='Trung bình' />
					<Badge color='#52c41a' text='Hoàn thành' />
					<Badge color='#1890ff' text='Đang làm' />
				</Space>
			</div>

			<div style={{ height: '75vh', minHeight: '500px' }}>
				<Calendar
					localizer={localizer}
					events={events}
					startAccessor='start'
					endAccessor='end'
					views={[Views.MONTH, Views.WEEK, Views.AGENDA]}
					eventPropGetter={eventStyleGetter}
					components={{
						event: CustomEvent,
					}}
					messages={{
						next: 'Sau',
						previous: 'Trước',
						today: 'Hôm nay',
						month: 'Tháng',
						week: 'Tuần',
						day: 'Ngày',
						agenda: 'Sự kiện',
						date: 'Ngày',
						time: 'Thời gian',
						event: 'Công việc',
						noEventsInRange: 'Không có nhiệm vụ nào trong giai đoạn này.',
					}}
				/>
			</div>

			<div style={{ marginTop: 20, textAlign: 'right' }}>
				<Text type='secondary' italic>
					<InfoCircleOutlined /> Nhấp vào ô sự kiện hoặc chuyển sang chế độ "Tuần" để xem chi tiết hơn.
				</Text>
			</div>
		</Card>
	);
};

export default TaskCalendar;
