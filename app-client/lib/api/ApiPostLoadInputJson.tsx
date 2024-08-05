'use client'
import axios from 'axios';

export default async function apiPostLoadInputJson(
  prjId: string, inputFile: string
) {
  try {
    const data = inputFile;
    const config = {
      method: 'POST',
      maxBodyLength: Infinity,
      url: `http://localhost:8001/v1/prj/${prjId}/job/load?n=input.json`,
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
