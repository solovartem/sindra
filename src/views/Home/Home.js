import React, { useEffect,useState,useRef } from 'react';
import { Tabs } from '../../components/Tabs';
import BasicDetails from '../../containers/BasicDetails';
import InvestmentTable from '../../containers/InvestmentTable';
import InsuranceTable from '../../containers/InsuranceTable';
import RecommendedStrategies from '../../containers/RecommendedStrategies';
import { Feedback } from '../../components/Feedback';
import Ancilliary from '../../containers/Ancilliary';
import { startForm } from'../../axios/login';

import { InfoCircleOutlined } from '@ant-design/icons';

const Home = ({  toggleError, setValidateRef }) => {
  const [activeTab,setActiveTab]=useState('Basic Details')
  const [tabsHasErrors,setTabsHasErrors ] = useState([])
  const [investmentPlatformsFromStrategies, setInvestmentPlatformsFromStrategies] = useState([]);

  const validateBasicDetails = useRef()
  const validateStrategies = useRef()
  const validateInvestment = useRef()
  const validateInsurance = useRef()
  const validateAnciallary = useRef()

  const validateAlltabsForSubmit = () => {
    validateBasicDetails.current(true)
    validateStrategies.current()
    validateInvestment.current()
    validateInsurance.current()
    validateAnciallary.current(true)
  }

  useEffect(() => {
    let hasError = !!tabsHasErrors.length
    console.log("ERRORs" , tabsHasErrors);
    toggleError(hasError);
  }, [tabsHasErrors])

  useEffect(() => {
    setValidateRef(validateAlltabsForSubmit)
  })



  const handleChangeTab = (newActiveKey) => {
    if (newActiveKey !== activeTab){
      if(activeTab==="Basic Details"){
        validateBasicDetails.current()
      }
      else if(activeTab==="Recommended Strategies"){
        validateStrategies.current()
      }
      else if(activeTab==="Investment Products"){
        validateInvestment.current()
      }
      else if(activeTab==="Insurance Products"){
        validateInsurance.current()
      }
      else if(activeTab==="Ancillary"){
        validateAnciallary.current()
      }
      setActiveTab(newActiveKey)
    }
  }
  const tabs = [
    {
      title: "Basic Details",
      tab: (
        <span>
          {(tabsHasErrors.includes("Basic Details") ) && <InfoCircleOutlined style={{ color: "red" }} />}Basic Details
        </span>
      ),
      component: <BasicDetails setTabsHasErrors={setTabsHasErrors} tabHasErrors={tabsHasErrors.includes("Basic Details")} validateBasicDetails={validateBasicDetails}/>,
    },
    {
      title: "Recommended Strategies",
      tab: (
        <span>
          {tabsHasErrors.includes("Recommended Strategies") && <InfoCircleOutlined style={{ color: "red" }} />}
          Recommended Strategies
        </span>
      ),
      component: (
        <RecommendedStrategies
          setTabsHasErrors={setTabsHasErrors}
          tabsHasErrors={tabsHasErrors}
          setInvestmentPlatformsFromStrategies={setInvestmentPlatformsFromStrategies}
          validateStrategies={validateStrategies}
        />
      ),
    },
    {
      title: "Investment Products",
      tab: (
        <span>
          {tabsHasErrors.includes("Investment Products") && <InfoCircleOutlined style={{ color: "red" }} />}Investment
          Products
        </span>
      ),
      component: (
        <InvestmentTable
          setTabsHasErrors={setTabsHasErrors}
          investmentPlatformsFromStrategies={investmentPlatformsFromStrategies}
          validateInvestment={validateInvestment}
        />
      ),

    },
    {
      title: "Insurance Products",
      tab: (
        <span>
          {tabsHasErrors.includes("Insurance Products") && <InfoCircleOutlined style={{ color: "red" }} />}Insurance
          Products
        </span>
      ),
      component: <InsuranceTable setTabsHasErrors={setTabsHasErrors} validateInsurance={validateInsurance} tabsHasErrors={tabsHasErrors} />,
    },
    {
      title: "Ancillary",
      tab: (
        <span>{(tabsHasErrors.includes("Ancilliary") ) && <InfoCircleOutlined style={{ color: "red" }} />}Ancillary</span>
      ),
      component: <Ancilliary setTabsHasErrors={setTabsHasErrors} validateAnciallary={validateAnciallary} tabHasErrors={tabsHasErrors.includes("Ancilliary")} />,
    },
  ];
  useEffect(()=>{startForm()},[])

  return (
    <>
    {console.log(tabsHasErrors)}
      <Tabs
        tabs={tabs}
        activeKey={activeTab}
        onChange={handleChangeTab}
        defaultActiveKey='Basic Details'
        centered
      > </Tabs>
    </>
  );
}

export default Home;
