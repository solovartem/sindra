import ApiUtils from "../../utils/apiUtils";

const getInsuranceProducts = async (serviceOffering)=> {
	const { data } = await ApiUtils.HTTPS.get(`/data/insurance?serviceOffering=${serviceOffering}`);
	return data
};

const postDocument = async (payload, type, config) => {
  const soaId=localStorage.getItem('soaId');
  const { data } = await ApiUtils.HTTPS.post(`/soa/${soaId}/insurance/${type}`, payload, config);
  return data
}

export { getInsuranceProducts,postDocument }