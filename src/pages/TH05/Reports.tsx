import React, { useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Statistic, Button } from 'antd';
import ColumnChart from '@/components/Chart/ColumnChart';
import * as XLSX from 'xlsx';

const Reports: React.FC<any> = ({ clubs = [], apps = [] }) => {
	const stats = useMemo(() => {
		const pending = apps.filter((r: any) => r.status === 'Pending').length;
		const approved = apps.filter((r: any) => r.status === 'Approved').length;
		const rejected = apps.filter((r: any) => r.status === 'Rejected').length;

		const chartData = {
			xAxis: clubs.map((c: any) => c.name),
			yAxis: [
				clubs.map((c: any) => apps.filter((r: any) => r.clubId === c.id && r.status === 'Pending').length),
				clubs.map((c: any) => apps.filter((r: any) => r.clubId === c.id && r.status === 'Approved').length),
				clubs.map((c: any) => apps.filter((r: any) => r.clubId === c.id && r.status === 'Rejected').length),
			],
			yLabel: ['Chờ duyệt (Pending)', 'Đã duyệt (Approved)', 'Từ chối (Rejected)'],
		};

		return { totalClubs: clubs.length, pending, approved, rejected, chartData };
	}, [clubs, apps]);

	const exportToExcel = () => {
		const approvedMembers = apps.filter((r: any) => r.status === 'Approved');
		const data = approvedMembers.map((m: any) => ({
			'Họ tên': m.fullName,
			Email: m.email,
			SĐT: m.phone,
			'Giới tính': m.gender,
			'Địa chỉ': m.address,
			'Sở trường': m.strength || m.talents,
			'Câu lạc bộ': clubs.find((c: any) => c.id === m.clubId)?.name || '',
		}));

		const ws = XLSX.utils.json_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'ThanhVien');
		XLSX.writeFile(wb, 'DanhSachThanhVien.xlsx');
	};

	return (
		<PageContainer
			extra={[
				<Button key='export' type='primary' onClick={exportToExcel}>
					Xuất danh sách thành viên (Excel)
				</Button>,
			]}
		>
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col span={6}>
					<Card>
						<Statistic title='Tổng số Câu lạc bộ' value={stats.totalClubs} />
					</Card>
				</Col>

				<Col span={6}>
					<Card>
						<Statistic title='Đơn đang chờ duyệt' value={stats.pending} valueStyle={{ color: '#faad14' }} />
					</Card>
				</Col>

				<Col span={6}>
					<Card>
						<Statistic title='Đơn đã duyệt' value={stats.approved} valueStyle={{ color: '#52c41a' }} />
					</Card>
				</Col>

				<Col span={6}>
					<Card>
						<Statistic title='Đơn đã từ chối' value={stats.rejected} valueStyle={{ color: '#f5222d' }} />
					</Card>
				</Col>
			</Row>

			<Card title='Thống kê đơn đăng ký theo từng Câu lạc bộ'>
				<ColumnChart {...stats.chartData} height={400} />
			</Card>
		</PageContainer>
	);
};

export default Reports;
