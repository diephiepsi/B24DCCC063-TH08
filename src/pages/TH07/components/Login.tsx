import React from 'react';
import { Card, Form, Input, Button, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface LoginProps {
	allUsers: any[];
	setAllUsers: (users: any[]) => void;
	setCurrentUser: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ allUsers, setAllUsers, setCurrentUser }) => {
	const onFinish = (values: any) => {
		const { username, password } = values;
		const user = allUsers.find((u: any) => u.username === username);

		if (user) {
			if (user.password === password) {
				setCurrentUser(username);
				message.success(`Chào mừng ${username} quay trở lại!`);
			} else {
				message.error('Mật khẩu không chính xác!');
			}
		} else {
			const newUser = { username, password };
			const updatedUsers = [...allUsers, newUser];
			setAllUsers(updatedUsers);
			localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
			setCurrentUser(username);
			message.success('Tài khoản mới đã được tạo và đăng nhập thành công!');
		}
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				padding: '20px',
			}}
		>
			<Card
				bordered={false}
				style={{
					width: '100%',
					maxWidth: 400,
					borderRadius: 24,
					boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
					background: 'rgba(255, 255, 255, 0.85)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(255, 255, 255, 0.2)',
				}}
			>
				<div style={{ textAlign: 'center', marginBottom: 40 }}>
					<div
						style={{
							width: 80,
							height: 80,
							background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
							borderRadius: '22px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							margin: '0 auto 20px',
							boxShadow: '0 8px 16px rgba(114, 46, 209, 0.3)',
							transform: 'rotate(-10deg)',
						}}
					>
						<RocketOutlined style={{ fontSize: 40, color: '#fff', transform: 'rotate(10deg)' }} />
					</div>
					<Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1a1a1a' }}>
						TASK LOG
					</Title>
					<Text type='secondary' style={{ fontSize: 16 }}>
						Quản lý công việc hiệu quả hơn
					</Text>
				</div>

				<Form name='login_modern' layout='vertical' onFinish={onFinish} size='large' autoComplete='off'>
					<Form.Item name='username' rules={[{ required: true, message: 'Vui lòng nhập Username!' }]}>
						<Input
							prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
							placeholder='Tên đăng nhập'
							style={{ borderRadius: 12, height: 50 }}
						/>
					</Form.Item>

					<Form.Item name='password' rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
						<Input.Password
							prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
							placeholder='Mật khẩu'
							style={{ borderRadius: 12, height: 50 }}
						/>
					</Form.Item>

					<Form.Item style={{ marginTop: 24 }}>
						<Button
							type='primary'
							htmlType='submit'
							block
							icon={<LoginOutlined />}
							style={{
								height: 55,
								borderRadius: 14,
								fontSize: 17,
								fontWeight: 700,
								background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
								border: 'none',
								boxShadow: '0 6px 20px rgba(114, 46, 209, 0.4)',
							}}
						>
							ĐĂNG NHẬP NGAY
						</Button>
					</Form.Item>
				</Form>

				<Divider plain>
					<Text type='secondary' style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
						Secure Access
					</Text>
				</Divider>

				<div style={{ textAlign: 'center' }}>
					<Text type='secondary'>Hệ thống tự động đăng ký cho người dùng mới</Text>
				</div>
			</Card>
		</div>
	);
};

export default Login;
