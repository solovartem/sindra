import React from 'react';
// import { Collapse } from 'antd';
import TableComponent from './TableComponent';

const TablesList = ({
   tables,
   handlePostTable,
   isAddTablePending,
   client,
   partner,
   serviceOffering,
   setTabsHasErrors,
   validateInsurance
}) => {
  // const exampleData = {
  //   "1": [
  //     {"platform":"Platform 1","owner":"client","platform1ToConsider":{"customValue":null,"platformId":"option1"},"platform2ToConsider":{"customValue":"Deneme","platformId":null},"valueOfNewPortfolio":"1234","riskProfile":"moderateg50","riskProfileCheckboxes":["accumulation"]},
  //     {"platform":"Platform 2","owner":"parter","platform1ToConsider":{"customValue":"Deneme","platformId":null},"platform2ToConsider":{"customValue":"Deneme2","platformId":null},"valueOfNewPortfolio":"12345","riskProfile":"moderateg60","riskProfileCheckboxes":["retirement"]},
  //     {"platform":"Platform 3","owner":"parter","platform1ToConsider":{"customValue":null,"platformId":"option2"},"platform2ToConsider":{"customValue":null,"platformId":"option1"},"valueOfNewPortfolio":"123","riskProfile":"moderateg70","riskProfileCheckboxes":["lowCost","practiceSpecific"]}
  //   ],
  //   "2": [
  //     {"platform":"Platform 1","owner":"client","platform1ToConsider":{"customValue":null,"platformId":"option1"},"platform2ToConsider":{"customValue":"Deneme","platformId":null},"valueOfNewPortfolio":"1234","riskProfile":"moderateg50","riskProfileCheckboxes":["accumulation"]},
  //     {"platform":"Platform 2","owner":"parter","platform1ToConsider":{"customValue":"Deneme","platformId":null},"platform2ToConsider":{"customValue":"Deneme2","platformId":null},"valueOfNewPortfolio":"12345","riskProfile":"moderateg60","riskProfileCheckboxes":["retirement"]},
  //     {"platform":"Platform 3","owner":"parter","platform1ToConsider":{"customValue":null,"platformId":"option2"},"platform2ToConsider":{"customValue":null,"platformId":"option1"},"valueOfNewPortfolio":"123","riskProfile":"moderateg70","riskProfileCheckboxes":["lowCost","practiceSpecific"]}
  //   ]
  // };

  return (
    <>
      <TableComponent
        handlePostTable={handlePostTable}
        isAddTablePending={isAddTablePending}
        client={client}
        partner={partner}
        serviceOffering={serviceOffering}
        validateInsurance={validateInsurance}
        setTabsHasErrors={setTabsHasErrors}
      />
    </>
  )
}

export default TablesList;