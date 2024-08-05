'use client'
import axios from 'axios';

export default async function apiGetPrjId() {
  try {
    const data = '';
    const config = {
      method: 'GET',
      maxBodyLength: Infinity,
      url: 'http://localhost:8001/v1/prj',
      headers: {},
      data: data
    };

    const response = await axios.request(config);
    if (!response?.data?.prj_ids?.length) throw Error('ErrThereAreNoProjects');
    const prjId = response?.data.prj_ids?.sort().reverse()[0];
    return prjId;
  } catch (error: any) {
    throw new Error(error);
  }
}
