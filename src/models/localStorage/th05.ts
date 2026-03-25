import { useState, useEffect } from 'react';
import { MemberRecord } from '../../pages/TH05/utils';

export default () => {
	const [role, setRole] = useState<'admin' | 'user'>('user');

	const [clubs, setClubs] = useState<any[]>(() => {
		const saved = localStorage.getItem('th5_clubs');
		return saved ? JSON.parse(saved) : [];
	});

	const [apps, setApps] = useState<MemberRecord[]>(() => {
		const saved = localStorage.getItem('th5_apps');
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem('th5_clubs', JSON.stringify(clubs));
	}, [clubs]);

	useEffect(() => {
		localStorage.setItem('th5_apps', JSON.stringify(apps));
	}, [apps]);

	useEffect(() => {
		localStorage.setItem('th5_role', role);
	}, [role]);

	useEffect(() => {
		const savedRole = localStorage.getItem('th5_role');
		if (savedRole) setRole(savedRole as 'admin' | 'user');
	}, []);

	return {
		role,
		setRole,
		clubs,
		setClubs,
		apps,
		setApps,
	};
};
