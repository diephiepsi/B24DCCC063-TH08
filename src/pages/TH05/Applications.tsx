import React, { useState, useMemo } from 'react';
import {
	Table,
	Button,
	Space,
	Modal,
	Input,
	Tag,
	Typography,
	Card,
	message,
	Popconfirm,
	Form,
	Select,
	Switch,
	Timeline,
	Empty,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { MemberRecord, Status, Log } from './utils';

const { Title, Text } = Typography;
const { TextArea, Search } = Input;

interface Props {
	data: MemberRecord[];
	clubs: { id: string; name: string }[];
	onChange: (d: MemberRecord[]) => void;
	role: 'admin' | 'user';
	setRole: (r: 'admin' | 'user') => void;
}

const Applications: React.FC<Props> = ({ data, clubs, onChange, role, setRole }) => {
	const [keys, setKeys] = useState<React.Key[]>([]);
	const [rejOpen, setRejOpen] = useState(false);
	const [crtOpen, setCrtOpen] = useState(false);
	const [rs, setRs] = useState('');
	const [logs, setLogs] = useState<Log[] | null>(null);
	const [kw, setKw] = useState('');
	const [f] = Form.useForm();

	const list = useMemo(() => data.filter((i) => i.name.toLowerCase().includes(kw.toLowerCase())), [data, kw]);

	const upd = (ids: React.Key[], st: Status, note?: string) => {
		if (role !== 'admin') return;

		const lg: Log = {
			admin: 'Admin',
			action: st,
			date: moment().format('HH:mm DD/MM/YYYY'),
			note,
		};

		const newData = data.map((i) =>
			ids.includes(i.id) && i.status === 'Pending' ? { ...i, status: st, history: [lg, ...i.history] } : i,
		);

		onChange(newData);
		setKeys([]);
		message.success('Cập nhật thành công');
	};

	const del = (id: string) => {
		if (role !== 'admin') return;
		onChange(data.filter((i) => i.id !== id));
	};

	const crt = (v: any) => {
		if (role !== 'user') return;

		const c = clubs.find((x) => x.id === v.clubId);

		const lg: Log = {
			admin: 'User',
			action: 'Pending',
			date: moment().format('HH:mm DD/MM/YYYY'),
			note: 'Tạo đơn',
		};

		const item: MemberRecord = {
			id: Date.now().toString(),
			...v,
			clubName: c?.name || '',
			status: 'Pending',
			history: [lg],
		};

		onChange([item, ...data]);
		setCrtOpen(false);
		f.resetFields();
		message.success('Tạo đơn thành công');
	};

	const cols: ColumnsType<MemberRecord> = [
		{
			title: 'Người đăng ký',
			dataIndex: 'name',
			render: (v, r) => (
				<>
					<Text strong>{v}</Text>
					<br />
					<Text type='secondary'>{r.email}</Text>
				</>
			),
		},
		{ title: 'SĐT', dataIndex: 'phone' },
		{ title: 'CLB', dataIndex: 'clubName' },
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			render: (s: Status) => {
				const c = { Pending: 'orange', Approved: 'green', Rejected: 'red' };
				return <Tag color={c[s]}>{s}</Tag>;
			},
		},
		{
			title: 'Lịch sử',
			render: (_, r) => <Button onClick={() => setLogs(r.history)}>Xem</Button>,
		},
		{
			title: '',
			render: (_, r) =>
				role === 'admin' && (
					<Popconfirm title='Xóa?' onConfirm={() => del(r.id)}>
						<Button danger size='small' icon={<DeleteOutlined />} />
					</Popconfirm>
				),
		},
	];

	return (
		<Card bordered={false}>
			<Space style={{ width: '100%', justifyContent: 'space-between' }}>
				<Title level={5}>Quản lý đơn</Title>

				<Space>
					<span>Chế độ</span>
					<Switch
						checkedChildren='ADMIN'
						unCheckedChildren='USER'
						checked={role === 'admin'}
						onChange={(v) => setRole(v ? 'admin' : 'user')}
					/>

					<Search placeholder='Tìm tên...' allowClear onChange={(e) => setKw(e.target.value)} style={{ width: 200 }} />

					{role === 'user' && (
						<Button type='primary' icon={<PlusOutlined />} onClick={() => setCrtOpen(true)}>
							Tạo đơn
						</Button>
					)}
				</Space>
			</Space>

			{role === 'admin' && (
				<Space style={{ margin: '16px 0' }}>
					<Button disabled={!keys.length} type='primary' onClick={() => upd(keys, 'Approved')}>
						Duyệt
					</Button>

					<Button danger disabled={!keys.length} onClick={() => setRejOpen(true)}>
						Từ chối
					</Button>
				</Space>
			)}

			<Table
				rowKey='id'
				rowSelection={
					role === 'admin'
						? {
								selectedRowKeys: keys,
								onChange: setKeys,
						  }
						: undefined
				}
				columns={cols}
				dataSource={list}
				pagination={{ pageSize: 5 }}
			/>

			<Modal title='Tạo đơn' visible={crtOpen} onCancel={() => setCrtOpen(false)} onOk={() => f.submit()}>
				<Form form={f} onFinish={crt} layout='vertical'>
					<Form.Item name='name' label='Họ tên' rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item name='email' label='Email' rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item name='phone' label='SĐT' rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item name='clubId' label='CLB' rules={[{ required: true }]}>
						<Select
							options={clubs.map((c) => ({
								label: c.name,
								value: c.id,
							}))}
						/>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Lý do từ chối'
				visible={rejOpen}
				onCancel={() => setRejOpen(false)}
				onOk={() => {
					if (!rs) return message.warning('Nhập lý do');
					upd(keys, 'Rejected', rs);
					setRs('');
					setRejOpen(false);
				}}
			>
				<TextArea value={rs} onChange={(e) => setRs(e.target.value)} />
			</Modal>

			<Modal title='Lịch sử xử lý' visible={!!logs} onCancel={() => setLogs(null)} footer={null}>
				{logs && logs.length > 0 ? (
					<Timeline>
						{logs.map((l, i) => (
							<Timeline.Item key={i}>
								<b>{l.admin}</b> - {l.action}
								<br />
								<Text type='secondary'>{l.date}</Text>
								<div>{l.note}</div>
							</Timeline.Item>
						))}
					</Timeline>
				) : (
					<Empty description='Chưa có lịch sử' />
				)}
			</Modal>
		</Card>
	);
};

export default Applications;
