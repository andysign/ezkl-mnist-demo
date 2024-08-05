'use client'
import axios from 'axios';

export default async function apiGetPrjFiles(prjId: string) {
	try {
		const config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: `http://localhost:8001/v1/prj/${prjId}`,
			headers: {}
		};

		const response = await axios.request(config);
		if (!response?.data?.response?.files) throw new Error('ErrNoFiles');
		return response?.data?.response?.files;
	} catch (error: any) {
		throw new Error(error);
	}
}