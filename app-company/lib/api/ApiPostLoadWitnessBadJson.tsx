'use client'
import axios from 'axios';

export default async function apiPostLoadWitnessBadJson(
	prjId: string, witnessModFile: string
) {
	try {
		const data = witnessModFile;

		const config = {
			method: 'post',
			maxBodyLength: Infinity,
			url: `http://localhost:8001/v1/prj/${prjId}/job/load?n=witness.json`,
			headers: {
				'Content-Type': 'application/json'
			},
			data: data
		};

		const response = await axios.request(config);
		return JSON.stringify(response.data);
	} catch (error: any) {
		throw new Error(error);
	}
}
