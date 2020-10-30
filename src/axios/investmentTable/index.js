import axios from 'axios';
import { env } from '../../config';
import ApiUtils from '../../utils/apiUtils';

const instance = axios.create({ baseURL: `${env.TABLE_API}/table` });

export const getInvestmentProducts = async (serviceOffering)=> {
	const { data } = await ApiUtils.HTTPS.get(`/data/investment?serviceOffering=${serviceOffering}`);
	return data
};

export const postDocument = async (payload, type, config) => {
  const soaId=localStorage.getItem('soaId');
  const { data } = await ApiUtils.HTTPS.post(`/soa/${soaId}/investment/${type}`, payload, config);
  return data
}

export default instance;
