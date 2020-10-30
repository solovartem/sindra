import React, { Fragment } from "react";
import DropdownComponent from "./Dropdown";
import { Col, Input, notification, Popconfirm, Row } from "antd";
import { uniqueId } from "lodash";
import RowItem from "./RowItem";
import ChildDropdownComponent from "./ChildDropDown";
import { CloseSquareOutlined } from "@ant-design/icons";
import { splitTextByFields } from "../../../utils/common";
import { call } from "redux-saga/effects";

const Card = props => {
  const {
    title,
    json,
    componentKey,
    partner,
    client,
    updateTableData,
    references,
    storedTableDatas,
    updateStoredTableData,
    callAPI,
    tabsHasErrors,
    setInvestmentPlatformsFromStrategies,
  } = props;

  const handleOnDropdownSelect = (value, key, tempKey, owner) => {
    console.log(
      "HANDLE DROPDOWN SELECT",
      componentKey,
      key,
      storedTableDatas.current
    );
    if (storedTableDatas.current[componentKey]) {
      updateTableData({
        ...storedTableDatas.current,
        [componentKey]: {
          ...storedTableDatas.current[componentKey],
          data: [
            {
              owner,
              dropdownKey: key,
              dropdownValue: value,
              children: [],
              id: uniqueId(),
            },
            ...storedTableDatas.current[componentKey].data,
          ],
        },
      });
    } else {
      const obj = {
        key: componentKey,
        title: title,
        owner,
        data: [
          {
            owner,
            dropdownKey: key,
            dropdownValue: value,
            children: [],
            id: uniqueId(),
          },
        ],
        reasonForRecommendation: { value: "", key: uniqueId() },
      };
      console.log(
        { ...storedTableDatas.current, [componentKey]: obj },
        updateTableData
      );
      updateTableData({ ...storedTableDatas.current, [componentKey]: obj });
    }
    // callAPI();

    if (key.includes("customstrategy")) {
      notification.info({
        message: "Delivery update",
        description:
          "Your pricing and completion date may change depending on the custom strategy provided",
      });
    }
  };

  const handleOnDropdownSelectChild = item => () => {
    const index = storedTableDatas.current[componentKey].data.findIndex(
      d => d.id === item.id
    );
    if (index !== -1) {
      const newData = [
        ...storedTableDatas.current[componentKey].data.slice(0, index),
        {
          ...storedTableDatas.current[componentKey].data[index],
          children: [
            ...(storedTableDatas.current[componentKey].data[index].children ||
              []),
            { value: "", key: uniqueId() },
          ],
        },
        ...storedTableDatas.current[componentKey].data.slice(index + 1),
      ];
      updateTableData({
        ...storedTableDatas.current,
        [componentKey]: {
          ...storedTableDatas.current[componentKey],
          data: [...newData],
        },
      });
      callAPI();
    }
  };

  const onStrategyChange = (item, child) => event => {
    const value = (event.target.value || "").trim();
    const index = storedTableDatas.current[componentKey].data.findIndex(
      d => d.id === item.id
    );
    if (index !== -1) {
      const childIndex = storedTableDatas.current[componentKey].data[
        index
      ].children.findIndex(c => c.key === child.key);
      const children = [
        ...storedTableDatas.current[componentKey].data[index].children.slice(
          0,
          childIndex
        ),
        {
          ...storedTableDatas.current[componentKey].data[index].children[
            childIndex
          ],
          value,
        },
        ...storedTableDatas.current[componentKey].data[index].children.slice(
          childIndex + 1
        ),
      ];

      const newData = [
        ...storedTableDatas.current[componentKey].data.slice(0, index),
        {
          ...storedTableDatas.current[componentKey].data[index],
          children,
        },
        ...storedTableDatas.current[componentKey].data.slice(index + 1),
      ];
      updateStoredTableData({
        ...storedTableDatas.current,
        [componentKey]: {
          ...storedTableDatas.current[componentKey],
          data: [...newData],
        },
      });
      callAPI();
    }
  };

  const onRecommendationChange = (event, item) => {
    const value = (event.target.value || "").trim();
    const index = storedTableDatas.current[componentKey].data.findIndex(
      d => d.id === item.id
    );
    if (index !== -1) {
      const newData = [
        ...storedTableDatas.current[componentKey].data.slice(0, index),
        {
          ...storedTableDatas.current[componentKey].data[index],
          reasonForRecommendation: { value },
        },
        ...storedTableDatas.current[componentKey].data.slice(index + 1),
      ];
      updateStoredTableData({
        ...storedTableDatas.current,
        [componentKey]: {
          ...storedTableDatas.current[componentKey],
          data: [...newData],
        },
      });
      callAPI();
    }
  };

  const onChildDelete = (item, child) => {
    const index = storedTableDatas.current[componentKey].data.findIndex(
      d => d.id === item.id
    );
    if (index !== -1) {
      const childIndex = storedTableDatas.current[componentKey].data[
        index
      ].children.findIndex(c => c.key === child.key);
      const children = [
        ...storedTableDatas.current[componentKey].data[index].children.slice(
          0,
          childIndex
        ),
        ...storedTableDatas.current[componentKey].data[index].children.slice(
          childIndex + 1
        ),
      ];

      const newData = [
        ...storedTableDatas.current[componentKey].data.slice(0, index),
        {
          ...storedTableDatas.current[componentKey].data[index],
          children,
        },
        ...storedTableDatas.current[componentKey].data.slice(index + 1),
      ];
      updateTableData({
        ...storedTableDatas.current,
        [componentKey]: {
          ...storedTableDatas.current[componentKey],
          data: [...newData],
        },
      });
      callAPI();
    }
  };

  const deleteRow = key => {
    const index = storedTableDatas.current[componentKey].data.findIndex(
      d => d.id === key
    );
    if (index !== -1) {
      updateTableData({
        ...storedTableDatas.current,
        [componentKey]: {
          ...storedTableDatas.current[componentKey],
          data: [
            ...storedTableDatas.current[componentKey].data.slice(0, index),
            ...storedTableDatas.current[componentKey].data.slice(index + 1),
          ],
        },
      });
      callAPI();
    }
  };

  const handleRequestRows = option => {
    const index = storedTableDatas.current[componentKey].data.findIndex(
      d => d.id === option.id
    );
    if (index !== -1) {
      let tableDatasAlias = { ...storedTableDatas.current };
      tableDatasAlias[componentKey].data[index].value = {
        ...tableDatasAlias[componentKey].data[index].value,
        [option.field.key]: option.field.value,
      };
      updateStoredTableData(tableDatasAlias);
      callAPI();
    }
  };

  return (
    <>
      <Row
        style={{
          padding: 30,
          width: "100%",
          overflowX: "auto",
          backgroundColor: "#FFFFFF",
          marginBottom: "34px",
        }}
      >
        <Col span={24} style={{ paddingLeft: "0px" }}>
          <DropdownComponent
            title={title}
            jsonData={json}
            handleOnDropdownSelect={handleOnDropdownSelect}
            client={client}
            partner={partner}
            references={references}
          />
        </Col>
        <Col span={24}>
          {storedTableDatas.current &&
            (storedTableDatas.current[componentKey]?.data || []).map(item => {
              console.log(item);
              const { dropdownKey, dropdownValue, id, owner } = item;
              const record = {
                dropdownKey,
                text: dropdownValue,
                id,
              };
              return (
                <div key={id} className="custom-table-row">
                  <RowItem
                    id={id}
                    owner={owner}
                    setInvestmentPlatformsFromStrategies={
                      setInvestmentPlatformsFromStrategies
                    }
                    text={dropdownValue}
                    record={record}
                    jsonData={json}
                    client={client}
                    partner={partner}
                    handleRequestData={() => {}}
                    formattedSortedTableDatas={() => {}}
                    handleStoredTableData={() => {}}
                    handleRequestRows={handleRequestRows}
                    deleteRow={deleteRow}
                    references={references}
                    storedTableDatas={storedTableDatas}
                    componentKey={componentKey}
                    tabsHasErrors={tabsHasErrors}
                  />
                  <Row style={{ padding: "15px 0" }}>
                    <Input.TextArea
                      autoSize
                      placeholder="Client specific reason for recommendation"
                      defaultValue={item?.reasonForRecommendation?.value || ""}
                      style={{ width: 600 }}
                      onChange={event => {
                        onRecommendationChange(event, item);
                      }}
                    />
                  </Row>
                  <ChildDropdownComponent
                    title="Add alternate Strategy"
                    jsonData={json}
                    handleOnDropdownSelect={handleOnDropdownSelectChild(item)}
                    owner={{ ...client, key: "client" }}
                    selectedData={storedTableDatas.current[componentKey]}
                  />
                  <Row>
                    {item.children &&
                      item.children.map(child => {
                        return (
                          <Fragment key={child.id}>
                            <Col
                              span={23}
                              style={{ padding: "16px 16px 8px 34px" }}
                            >
                              <Input.TextArea
                                autoSize
                                id={child.id}
                                style={{ width: 400 }}
                                placeholder="Enter alternate strategy"
                                defaultValue={child.value}
                                onChange={onStrategyChange(item, child)}
                              />
                            </Col>
                            <Col span={1} style={{ paddingTop: 16 }}>
                              <Popconfirm
                                placement="topRight"
                                title="Are you sure you want to delete this alternate strategy?"
                                key={uniqueId()}
                                onConfirm={() => {
                                  onChildDelete(item, child);
                                }}
                              >
                                <CloseSquareOutlined
                                  key={uniqueId()}
                                  style={{ fontSize: 25, paddingLeft: "12px" }}
                                />
                              </Popconfirm>
                            </Col>
                          </Fragment>
                        );
                      })}
                  </Row>
                </div>
              );
            })}
        </Col>
      </Row>
    </>
  );
};

export default Card;
