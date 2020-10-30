import React, { useState, useEffect, useRef } from 'react';
import { isEmpty, omit, get } from 'lodash';
import { Row, Col } from 'antd';

import DropdownComponent from './Dropdown';
import Table from './Table';
import ChildDropdownComponent from './ChildDropDown';

const Merge = ({
  title,
  json = {},
  client = {},
  partner = {},
  handleRequestData,
  storedTableDatas,
  handleStoredTableDatas,
  withChild,
  newSelectedDropdownValue
}) => {
  const [jsonData, setJsonData] = useState();
  const [selectedDropdownValue, setSelectedDropdownValue] = useState({});
  const [updateState, setUpdateState] = useState(false);
  const rows = useRef(get(storedTableDatas.current, [`${title}`,'inputValues'], {}));

  useEffect(() => {
    setJsonData(json);
  }, [json]);

  const handleOnDropdownSelect = (value, key) => {
    //console.log(selectedDropdownValue);
    setSelectedDropdownValue({ ...selectedDropdownValue , dropdownKey: key, dropdownValue: value });
  };

    const handleRequestRows = ({ record, field, deleteRow }) => {
    if (deleteRow) {
      rows.current = omit(rows.current, record);
      handleRequestData({
        title,
        rows: rows.current
      });
      setUpdateState(!updateState);
    }else{
      if (!isEmpty(field)) {
        rows.current = Object.assign({}, rows.current, {
          [record]: {
            ...rows.current[record],
            [field.key]: field.value
          }
        });
      }else {
        const owner = record.split('.')[0];
        rows.current = Object.assign({}, rows.current, { [record]: {
          owner
        }});
      }
      handleRequestData({
        title,
        rows: rows.current
      });
    }
  };

  return (
    <>
      <Row
          gutter={[16, 24]}
          style={{
            padding: withChild ? 30 : '20px 0px 20px 20px',
            width: '100%',
            overflowX: withChild ? 'auto' : 'hidden',
            backgroundColor: '#FFFFFF',
            marginBottom: '34px',
            margin: '-12px 0px 34px'
          }}
      >
        <Col span={24} style={{paddingLeft: '0px'}}>
          {withChild?
           <DropdownComponent
             title={title}
             jsonData={jsonData}
             handleOnDropdownSelect={handleOnDropdownSelect}
             client={client}
             partner={partner}
           />:
           <ChildDropdownComponent
            title={title}
            jsonData={jsonData}
            handleOnDropdownSelect={handleOnDropdownSelect}
            owner={{...client,key:'client'}}
          />
          }
        </Col>
        <Col span={24} >
          <div className="custom-table-class">
            <Table
              selectedDropdownValue={selectedDropdownValue}
              title={title}
              client={client}
              partner={partner}
              handleRequestRows={handleRequestRows}
              inputValues={rows.current}
              storedTableDatas={storedTableDatas.current[title]}
              handleStoredTableDatas={({ dataSource, inputValues }) => {

                handleStoredTableDatas({ title, dataSource, inputValues })
              }}
              jsonData={jsonData}
              handleOnDropdownSelect={handleOnDropdownSelect}
              handleRequestData={handleRequestData}
              handleStoredTableData={handleStoredTableDatas}
              formattedSortedTableDatas={storedTableDatas}
              withChild={withChild}
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Merge;
