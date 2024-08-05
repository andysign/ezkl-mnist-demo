'use client'
import axios from 'axios';

export default async function apiPostLoadAboutTxt(
  prjId: string, oldName: string
) {
  try {
    const data = JSON.stringify({
      "name": oldName,
      "request": true
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8001/v1/prj/${prjId}/job/load?n=about_project.txt`,
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
