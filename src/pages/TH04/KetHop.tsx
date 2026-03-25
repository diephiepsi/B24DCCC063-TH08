import { useModel } from 'umi';
import SoVanBangForm from './QuanLySoQuyetDinh';
import QuyetDinhForm from './QuyetDinhForm';

const QuanLy = () => {
	const model = useModel('TH04.localStorage') as any;

	const activeSoVanBang = model?.soVanBang || model?.ledgers || [];
	const activeQuyetDinh = model?.quyetDinh || model?.decisions || [];

	const handleSetSoVanBang = (val: any) => {
		if (model?.setSoVanBang) model.setSoVanBang(val);
		if (model?.setLedgers) model.setLedgers(val);
	};
	const handleSetQuyetDinh = (val: any) => {
		if (model?.setQuyetDinh) model.setQuyetDinh(val);
		if (model?.setDecisions) model.setDecisions(val);
	};

	return (
		<div style={{ padding: 24 }}>
			<SoVanBangForm soVanBang={activeSoVanBang} setSoVanBang={handleSetSoVanBang} />

			<QuyetDinhForm
				quyetDinh={activeQuyetDinh}
				setQuyetDinh={handleSetQuyetDinh}
				soVanBang={activeSoVanBang}
				setSoVanBang={handleSetSoVanBang}
			/>
		</div>
	);
};

export default QuanLy;
