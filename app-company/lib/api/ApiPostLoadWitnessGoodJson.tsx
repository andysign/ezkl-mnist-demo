'use client'
import axios from 'axios';

export default async function apiPostLoadWitnessGoodJson(
  prjId: string, witnessFile: string
) {
  try {
    const data = witnessFile;

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
