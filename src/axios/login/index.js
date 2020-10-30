import ApiUtils from '../../utils/apiUtils';

const startForm= async ()=>{
  const {data}= await ApiUtils.HTTPS.post('/soa');
  localStorage.setItem('soaId',data.soaId)
  return data
}

const syncTabData= async ({tab,tableData})=>{
  const soaId=localStorage.getItem('soaId');
  const {data}= await ApiUtils.HTTPS.put(`/soa/${soaId}/${tab}`,JSON.stringify({...tableData}));
  return data
}

const submitInfo= async ()=>{
  const soaId=localStorage.getItem('soaId');
  const {data}= await ApiUtils.HTTPS.put(`/soa/${soaId}/?action=submit`);
  return data
}

const getPriceData = async ()=>{
  const soaId=localStorage.getItem('soaId');
  const {data}= await ApiUtils.HTTPS.get(`/soa/${soaId}/pricing`);
  return data
}


const submitFeedback = async payload => {
  const soaId=localStorage.getItem('soaId');
  const { data } = await ApiUtils.HTTPS.put(`/soa/${soaId}/?action=rating`, payload);
  return data
}

export  { startForm, syncTabData, submitInfo, submitFeedback, getPriceData };
