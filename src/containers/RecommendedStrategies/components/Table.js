/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { uniqueId, get, isEmpty } from "lodash";
import {
  Table,
  Input,
  Typography,
  DatePicker,
  InputNumber,
  Select,
  Popconfirm,
  Dropdown, Row
} from "antd";
import { CloseSquareTwoTone } from "@ant-design/icons";
import {
  getOptionsBetweenBrackets,
  getPlaceholderFromText,
  splitTextByFields,
  getKeyFromText,
} from "../../../utils/common";
import "../index.css";
import Merge from "./Merge";
import RowItem from "./RowItem";

const { Text } = Typography;
const { Option } = Select;

const TableComponent = ({
  selectedDropdownValue,
  client,
  partner,
  handleRequestRows,
  inputValues,
  storedTableDatas,
  handleStoredTableDatas,
  jsonData,
  handleRequestData,
  handleStoredTableData,
  title,
  formattedSortedTableDatas,
  withChild = true,
}) => {
  const [columns, setColumns] = useState([]);
  const data = useRef(get(storedTableDatas, "dataSource", []));
  const [dataSource, setDataSource] = useState(
    get(storedTableDatas, "dataSource", [])
  );
  const deleteRow = (dropdownKey) => {
    const tempData = [...data.current];
    const newData = tempData.filter((row) => row.dropdownKey !== dropdownKey);

    data.current = newData;
    setDataSource(data.current);
    handleRequestRows({
      record: dropdownKey,
      deleteRow: true,
    });
  };

  useEffect(() => {
    handleStoredTableDatas({ dataSource });
  }, [dataSource]);

  useEffect(() => {
    handleStoredTableDatas({ inputValues });
  }, [inputValues]);

  useEffect(() => {
    const _columns = [
      // {
      //   title: 'Path',
      //   dataIndex: 'path',
      //   key: 'path',
      // },
      {
        title: "Text",
        dataIndex: "text",
        key: "text",
        render: (text, record) => {
          return(
            <RowItem
            text={text}
            record={record}
            jsonData={jsonData}
            client={client}
            partner={partner}
            handleRequestData={handleStoredTableDatas}
            formattedSortedTableDatas={formattedSortedTableDatas}
            handleStoredTableData={handleStoredTableDatas}
            inputValues={inputValues}
            handleRequestRows={handleRequestRows}
            deleteRow={deleteRow}
            withChild={withChild}
          />
          )

        },
      },
      // {
      //   title: "Actions",
      //   key: "actions",
      //   align: "center",
      //   render: (text, record) => (
      //     <Popconfirm
      //       title="Sure to delete?"
      //       key={uniqueId()}
      //       onConfirm={() => deleteRow(record.dropdownKey)}
      //     >
      //       {/* <Button type="danger"> */}
      //       <CloseSquareTwoTone key={uniqueId()} style={{ fontSize: 25 }} />
      //       {/* </Button> */}
      //     </Popconfirm>
      //   ),
      // },
    ];
    setColumns(_columns);
  }, [client, partner, dataSource]);

  useEffect(() => {
    const isSelectedExists = !isEmpty(
      data.current.find(
        (x) => x.dropdownKey === selectedDropdownValue.dropdownKey
      )
    );
    if (selectedDropdownValue.dropdownValue && !isSelectedExists) {
      // const path = getPathFromString(selectedDropdownValue.dropdownValue);
      const newRow = {
        key: uniqueId(),
        id: uniqueId(),
        // path,
        text: selectedDropdownValue.dropdownValue,
        dropdownKey: selectedDropdownValue.dropdownKey,
      };
      const tempData = [...data.current];

      tempData.push(newRow);
      data.current = tempData;
      setDataSource(data.current);
      handleRequestRows({
        record: selectedDropdownValue.dropdownKey,
      });
    }
  }, [selectedDropdownValue]);

  return (
    <Table
      key={uniqueId()}
      showHeader={false}
      pagination={false}
      columns={columns}
      dataSource={dataSource}
    />
  );
};

export default TableComponent;
