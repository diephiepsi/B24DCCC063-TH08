import React, { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormDatePicker, ProFormSelect, ProFormDigit } from '@ant-design/pro-form';
import moment from 'moment';

const ThongTinVanBang = ({
	diplomas,
	setDiplomas,
	fields,
	decisions,
	ledgers,
	setLedgers,
	quyetDinh,
	soVanBang,
	setSoVanBang,
}: any) => {
	const [visible, setVisible] = useState(false);

	const activeDecisions = decisions || quyetDinh || [];
	const activeLedgers = ledgers || soVanBang || [];

	const handleAdd = async (values: any) => {
		const qd = activeDecisions.find((d: any) => d.id === values.quyetDinhId);
		if (!qd) {
			message.error('Không tìm thấy quyết định!');
			return false;
		}
		const ledger = activeLedgers.find((l: any) => l.id === qd.soVanBangId);
		if (!ledger) {
			message.error('Quyết định chưa được gán vào sổ văn bằng nào!');
			return false;
		}

		const newSoVaoSo = (ledger.soHienTai || 0) + 1;

		const updatedLedgers = activeLedgers.map((l: any) => (l.id === ledger.id ? { ...l, soHienTai: newSoVaoSo } : l));
		if (setLedgers) setLedgers(updatedLedgers);
		if (setSoVanBang) setSoVanBang(updatedLedgers);

		const { soHieuVB, maSV, hoTen, ngaySinh, quyetDinhId, ...dynamicData } = values;

		const formattedDynamicData: any = {};
		fields?.forEach((f: any) => {
			if (f.kieuDuLieu === 'Date' && dynamicData[f.tenTruong]) {
				formattedDynamicData[f.tenTruong] = moment(dynamicData[f.tenTruong]).format('DD/MM/YYYY');
			} else if (dynamicData[f.tenTruong] !== undefined) {
				formattedDynamicData[f.tenTruong] = dynamicData[f.tenTruong];
			}
		});

		const newVB = {
			id: Date.now().toString(),
			soVaoSo: newSoVaoSo,
			soHieuVB,
			maSV,
			hoTen,
			ngaySinh: ngaySinh ? moment(ngaySinh).format('DD/MM/YYYY') : '',
			quyetDinhId,
			duLieuDong: formattedDynamicData,
		};

		setDiplomas([newVB, ...(diplomas || [])]);
		message.success(`Đã cấp bằng! Số vào sổ: ${newSoVaoSo}`);
		return true;
	};

	const columns: any[] = [
		{ title: 'Số vào sổ', dataIndex: 'soVaoSo', render: (val: any) => <b>{val}</b> },
		{ title: 'Số hiệu VB', dataIndex: 'soHieuVB' },
		{ title: 'Mã SV', dataIndex: 'maSV' },
		{ title: 'Họ tên', dataIndex: 'hoTen' },
		{ title: 'Ngày sinh', dataIndex: 'ngaySinh' },
		{
			title: 'Quyết định',
			dataIndex: 'quyetDinhId',
			render: (_: any, record: any) => {
				const qd = activeDecisions.find((d: any) => d.id === record.quyetDinhId);
				return qd ? <Tag color='blue'>{qd.soQD}</Tag> : '';
			},
		},
	];

	return (
		<>
			<ProTable
				headerTitle='Danh sách văn bằng đã cấp'
				dataSource={diplomas || []}
				columns={columns}
				rowKey='id'
				toolBarRender={() => [
					<Button key='add' type='primary' icon={<PlusOutlined />} onClick={() => setVisible(true)}>
						Thêm văn bằng
					</Button>,
				]}
				search={false}
			/>
			<ModalForm
				title='Cấp văn bằng mới'
				visible={visible}
				onVisibleChange={setVisible}
				onFinish={handleAdd}
				modalProps={{ destroyOnClose: true }}
			>
				<ProFormSelect
					name='quyetDinhId'
					label='Quyết định tốt nghiệp'
					request={async () => activeDecisions.map((d: any) => ({ label: d.soQD, value: d.id }))}
					params={{ activeDecisions }}
					rules={[{ required: true }]}
				/>
				<ProFormText name='soHieuVB' label='Số hiệu văn bằng' rules={[{ required: true }]} />
				<ProFormText name='maSV' label='Mã sinh viên' rules={[{ required: true }]} />
				<ProFormText name='hoTen' label='Họ tên' rules={[{ required: true }]} />
				<ProFormDatePicker name='ngaySinh' label='Ngày sinh' rules={[{ required: true }]} />

				{fields?.length > 0 && (
					<div style={{ padding: '16px', background: '#f5f5f5', marginBottom: 20, borderRadius: 8 }}>
						<p style={{ marginBottom: 16 }}>
							<b>Thông tin phụ lục (Cấu hình động):</b>
						</p>
						{fields.map((f: any) => {
							if (f.kieuDuLieu === 'Date')
								return <ProFormDatePicker key={f.id} name={f.tenTruong} label={f.tenTruong} />;
							if (f.kieuDuLieu === 'Number') return <ProFormDigit key={f.id} name={f.tenTruong} label={f.tenTruong} />;
							return <ProFormText key={f.id} name={f.tenTruong} label={f.tenTruong} />;
						})}
					</div>
				)}
			</ModalForm>
		</>
	);
};
export default ThongTinVanBang;
