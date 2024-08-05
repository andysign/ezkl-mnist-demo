'use client'
import axios from 'axios';

export default async function apiPostGenProofBad(prjId: string) {
  try {
    const data = JSON.stringify({
      "witness": "witness.json",
      "model": "network_bad.ezkl",
      "pk_path": "pk_bad.key"
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8001/v1/prj/${prjId}/job/gen-proof?out=proof.json`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
}
