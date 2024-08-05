'use client'
import axios from 'axios';

export default async function apiPostLoadProofJson(
  prjId: string, proofFile: string
) {
  try {
    const data = proofFile;

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8001/v1/prj/${prjId}/job/load?n=proof.json`,
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
