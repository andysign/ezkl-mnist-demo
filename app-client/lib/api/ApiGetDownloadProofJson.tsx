'use client'
import axios from 'axios';

export default async function apiGetDownloadProofJson(prjId: string) {
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://localhost:8001/v1/prj/${prjId}/job/download?f=proof.json`,
      headers: {}
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
}
