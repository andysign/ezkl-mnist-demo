'use client'
import axios from 'axios';

export default async function apiPostGenWitnessBad(prjId: string) {
  try {
    const data = JSON.stringify({
      "model": "network_bad.ezkl",
      "vk_path": "vk_bad.key",
      "srs_path": "kzg.srs"
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8001/v1/prj/${prjId}/job/gen-witness?out=witness.json`,
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
