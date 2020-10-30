import ApiUtils from '../../utils/apiUtils';

export const postDocument = async (payload, config) => {
  const soaId=localStorage.getItem('soaId');
  const { data } = await ApiUtils.HTTPS.post(`/soa/${soaId}/insurance/quote`, payload, config);
  return data
}
