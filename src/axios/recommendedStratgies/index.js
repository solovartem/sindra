import ApiUtils from '../../utils/apiUtils';

const getStrategies = async (serviceOffering)=> {
	const { data } = await ApiUtils.HTTPS.get(`/data/strategy?serviceOffering=${serviceOffering}`);
	return data
};

export  { getStrategies };
