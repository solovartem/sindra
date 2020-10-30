import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import TablesList from './components/TablesList';
import { Creators } from '../../redux/actions/investmentTable'
import { getTables, getIsPending, getIsAddTablePending } from '../../redux/selectors/investmentTable'
import { getClient, getPartner,getServiceOffering } from '../../redux/selectors/basicDetails'
import { BackTop, Input } from 'antd';

import './index.css';

const Tables = ({
  dispatch,
  tables,
  isPending,
  isAddTablePending,
  client,
  partner,
  serviceOffering,
  validateInsurance,
  setTabsHasErrors
}) => {
  // const [tableId, setTableId] = useState();

  useEffect(() => {
    dispatch(Creators.initContainer());

    return () => {
      dispatch(Creators.destroyContainer());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handlePostTable = (tableId, tableValues) => {
    if (tableId){
      dispatch(Creators.updateTableRequest({
        tableId,
        json: tableValues
      }));
    }else{
      dispatch(Creators.addTableRequest({ json: tableValues }));
    }
  }

  // const onGetTableClick = () => {
  //   dispatch(Creators.getTableRequest({ tableId }));
  // }
  // const onUpdateReduxClick = () => {
  //   dispatch(Creators.updateRedux({ client: clientName, partner: partnerName }));
  // }

  return (
    <>
      <TablesList
        key='investment'
        handlePostTable={handlePostTable}
        isAddTablePending={isAddTablePending}
        tables={tables}
        client={client}
        partner={partner}
        serviceOffering={serviceOffering}
        validateInsurance={validateInsurance}
        setTabsHasErrors={setTabsHasErrors}
      /><br/>
      {/*
        <Col span={2} offset={11}>
          <Input placeholder="Table ID" onChange={(event) => setTableId(event.target.value)}/>
        </Col>
        <Col span={2} offset={1}>
          <Button loading={isPending} onClick={onGetTableClick} type="primary">Get Table</Button>
        </Col>
      </Row> */}
      <BackTop />
    </>
  );
}

const mapStateToProps = state => ({
  tables: getTables(state),
  isPending: getIsPending(state),
  isAddTablePending: getIsAddTablePending(state),
  client: getClient(state),
  partner: getPartner(state),
  serviceOffering:getServiceOffering(state)
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tables);