'use client'
import axios from 'axios';

export default async function apiPostVerify(prjId: string) {
  try {
    const data = JSON.stringify({
      "settings_path": "settings_good.json",
      "vk_path": "vk_good.key"
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8001/v1/prj/${prjId}/job/verify`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    return error?.response?.data ? error?.response?.data : JSON.stringify(error);
  }
}
