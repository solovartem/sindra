import React, { useState } from "react";
import moment from "moment";
import { uniqueId, get, isEmpty } from "lodash";
import {
  Input,
  Typography,
  DatePicker,
  InputNumber,
  Select,
  Popconfirm,
  Row,
  Col,
  notification,
} from "antd";
import { CloseSquareTwoTone } from "@ant-design/icons";
import {
  getOptionsBetweenBrackets,
  getPlaceholderFromText,
  splitTextByFields,
  getKeyFromText,
} from "../../../utils/common";
import AutoResizeInput from "./AutoResizeInput";
import CustomSelectComponent from "./CustomSelectInput";
import { getInvestmentProducts } from "../../../axios/investmentTable";

import "../index.css";
import { useEffect } from "react";
import CalenderWithExtraFooter from "./CalenderWithExtraFooter";

const { Text } = Typography;
const { Option } = Select;

const RowItem = ({
  owner,
  record,
  text,
  withChild = true,
  handleRequestRows,
  deleteRow,
  references,
  storedTableDatas,
  componentKey,
  tabsHasErrors,
  setInvestmentPlatformsFromStrategies,
}) => {
  const splittedText = splitTextByFields(text);
  const monthFormat = "MMM YYYY";

  return (
    <>
      <Row
        style={{ width: "100%", alignItems: "baseline" }}
        align="middle"
        justify="space-between"
        className={"custom-divider"}
      >
        <Col span={23}>
          <ul
            style={{
              listStyle: "none",
              paddingLeft: withChild ? "10px" : "20px",
            }}
          >
            <li>
              {withChild ? (
                <Text key={uniqueId()} className="ownClass">
                  {(() => {
                    return splittedText.map(value => {
                      if (value.includes("{{text")) {
                        const placeholder = getPlaceholderFromText(value);
                        const key = getKeyFromText(value);
                        const selectedData = storedTableDatas.current[
                          componentKey
                        ].data.find(d => d.id === record.id);
                        const defaultValue = get(
                          selectedData,
                          ["value", key],
                          undefined
                        );
                        return (
                          <React.Fragment key={uniqueId()}>
                            <AutoResizeInput
                              type="text"
                              defaultValue={defaultValue}
                              tabsHasErrors={tabsHasErrors}
                              placeholder={placeholder}
                              handleRequestRows={handleRequestRows}
                              record={record}
                              _key={key}
                              splittedText={splittedText}
                            />
                            &nbsp;
                          </React.Fragment>
                        );
                      }
                      if (value.includes("{{date")) {
                        const key = getKeyFromText(value);
                        const selectedData = storedTableDatas.current[
                          componentKey
                        ].data.find(d => d.id === record.id);
                        let defaultValue = get(
                          selectedData,
                          ["value", key],
                          undefined
                        );
                        // Get id Date if any
                        const idDate = defaultValue?.startsWith("id:")
                          ? defaultValue.slice(defaultValue.indexOf(":") + 1)
                          : "";
                        // Parse date to moment object if any
                        defaultValue = !defaultValue
                          ? undefined
                          : defaultValue.startsWith("date:")
                          ? moment(
                              defaultValue.slice(defaultValue.indexOf(":") + 1),
                              "MM/YYYY"
                            )
                          : undefined;

                        console.log(selectedData, key, defaultValue, idDate);
                        return (
                          <React.Fragment key={uniqueId()}>
                            <CalenderWithExtraFooter
                              defaultValue={defaultValue}
                              idDate={idDate}
                              tabsHasErrors={tabsHasErrors}
                              monthFormat={monthFormat}
                              handleRequestRows={handleRequestRows}
                              record={record}
                              _key={key}
                              splittedText={splittedText}
                            />
                            &nbsp;
                          </React.Fragment>
                        );
                      }
                      if (value.includes("{{number")) {
                        const placeholder = getPlaceholderFromText(value);
                        const key = getKeyFromText(value);
                        const selectedData = storedTableDatas.current[
                          componentKey
                        ].data.find(d => d.id === record.id);
                        const defaultValue = get(
                          selectedData,
                          ["value", key],
                          undefined
                        );
                        return (
                          <React.Fragment key={uniqueId()}>
                            <AutoResizeInput
                              type="number"
                              defaultValue={defaultValue}
                              tabsHasErrors={tabsHasErrors}
                              placeholder={placeholder}
                              handleRequestRows={handleRequestRows}
                              record={record}
                              _key={key}
                              splittedText={splittedText}
                            />
                            &nbsp;
                          </React.Fragment>
                        );
                      }
                      if (value.includes("{{select")) {
                        const {
                          optionsArr,
                          key: optionKey,
                        } = getOptionsBetweenBrackets(value, references);
                        const key = getKeyFromText(value);
                        const selectedData = storedTableDatas.current[
                          componentKey
                        ].data.find(d => d.id === record.id);
                        const defaultValue = get(
                          selectedData,
                          ["value", key],
                          undefined
                        );
                        return (
                          <React.Fragment key={uniqueId()}>
                            <Select
                              showSearch
                              defaultValue={defaultValue}
                              key={uniqueId()}
                              dropdownClassName="custom-dropdown"
                              style={
                                tabsHasErrors.includes(
                                  "Recommended Strategies"
                                ) && !defaultValue
                                  ? {
                                      minWidth:
                                        optionKey === "xplan-products"
                                          ? 360
                                          : 200,
                                      border: "2px solid red",
                                    }
                                  : {
                                      minWidth:
                                        optionKey === "xplan-products"
                                          ? 360
                                          : 200,
                                    }
                              }
                              filterOption={(input, option) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              onChange={event => {
                                handleRequestRows({
                                  record: record.dropdownKey,
                                  field: { key, value: event },
                                  id: record.id,
                                });
                              }}
                            >
                              {(optionsArr || []).map(option => {
                                return (
                                  <Option key={option.key} value={option.key}>
                                    {option.value}
                                  </Option>
                                );
                              })}
                            </Select>
                            &nbsp;
                          </React.Fragment>
                        );
                      }
                      if (value.includes("{{multiselect")) {
                        const {
                          optionsArr,
                          key: optionKey,
                        } = getOptionsBetweenBrackets(value, references);
                        const key = getKeyFromText(value);
                        const selectedData = storedTableDatas.current[
                          componentKey
                        ].data.find(d => d.id === record.id);
                        const defaultValue = get(
                          selectedData,
                          ["value", key],
                          undefined
                        );
                        return (
                          <React.Fragment key={uniqueId()}>
                            <Select
                              mode="tags"
                              defaultValue={defaultValue}
                              key={uniqueId()}
                              style={
                                tabsHasErrors.includes(
                                  "Recommended Strategies"
                                ) && !defaultValue
                                  ? {
                                      width:
                                        optionKey === "xplan-products"
                                          ? 360
                                          : 120,
                                      border: "2px solid red",
                                    }
                                  : {
                                      width:
                                        optionKey === "xplan-products"
                                          ? 360
                                          : 120,
                                    }
                              }
                              onChange={(event, asd, qwe) => {
                                handleRequestRows({
                                  record: record.dropdownKey,
                                  field: { key, value: event },
                                  id: record.id,
                                });
                              }}
                            >
                              {optionsArr.map(option => {
                                return (
                                  <Option key={option.key} value={option.key}>
                                    {option.value}
                                  </Option>
                                );
                              })}
                            </Select>
                            &nbsp;
                          </React.Fragment>
                        );
                      }
                      if (value.includes("{{invselect")) {
                        const {
                          optionsArr,
                          key: optionKey,
                        } = getOptionsBetweenBrackets(value, references);
                        const key = getKeyFromText(value);
                        const selectedData = storedTableDatas.current[
                          componentKey
                        ].data.find(d => d.id === record.id);
                        const defaultValue = get(
                          selectedData,
                          ["value", key],
                          undefined
                        );

                        return (
                          <React.Fragment key={uniqueId()}>
                            <CustomSelectComponent
                              defaultValue={defaultValue}
                              options={optionsArr}
                              hasError={tabsHasErrors.includes(
                                "Recommended Strategies"
                              )}
                              onDropDownValueChangeCallback={(value, text) => {
                                handleRequestRows({
                                  record: record.dropdownKey,
                                  field: { key, value },
                                  id: record.id,
                                });
                                const targetProduct = value;
                                const platform = {
                                  targetProduct: targetProduct,
                                  owner: owner.toLowerCase(),
                                  text,
                                };

                                setInvestmentPlatformsFromStrategies(values => [
                                  ...values,
                                  platform,
                                ]);
                                console.log(platform);
                              }}
                            />
                            &nbsp;
                          </React.Fragment>
                        );
                      }
                      if (value.includes("{{invflipselect")) {
                        const {
                          optionsArr,
                          key: optionKey,
                        } = getOptionsBetweenBrackets(value, references);
                        const key = getKeyFromText(value);
                        const selectedData = storedTableDatas.current[
                          componentKey
                        ].data.find(d => d.id === record.id);
                        const defaultValue = get(
                          selectedData,
                          ["value", key],
                          undefined
                        );

                        return (
                          <React.Fragment key={uniqueId()}>
                            <CustomSelectComponent
                              defaultValue={defaultValue}
                              options={optionsArr}
                              hasError={tabsHasErrors.includes(
                                "Recommended Strategies"
                              )}
                              onDropDownValueChangeCallback={(value, text) => {
                                handleRequestRows({
                                  record: record.dropdownKey,
                                  field: { key, value },
                                  id: record.id,
                                });
                                console.log(owner);
                                const targetProduct = value;
                                const platform = {
                                  targetProduct: targetProduct,
                                  owner:
                                    owner.toLowerCase() === "client"
                                      ? "partner"
                                      : "client",
                                  text,
                                };
                                setInvestmentPlatformsFromStrategies(values => [
                                  ...values,
                                  platform,
                                ]);
                              }}
                            />
                            &nbsp;
                          </React.Fragment>
                        );
                      }
                      if (/\*.*\*/.test(value)) {
                        return (
                          <Text key={uniqueId()} strong>
                            {value.replace(/\*/g, "") + " "}
                          </Text>
                        );
                      }
                      if (/_.*_/.test(value)) {
                        return (
                          <Text
                            key={uniqueId()}
                            style={{ fontStyle: "italic" }}
                          >
                            {value.replace(/_/g, "") + " "}
                          </Text>
                        );
                      }
                      let preElValue = value.slice(0, value.indexOf("\\n"));
                      let postElvalue = value.slice(value.indexOf("\\n"));

                      let el = [];

                      if (value.includes("\\n")) {
                        el.push(<br key={uniqueId()} />);
                        postElvalue = postElvalue.slice(2);
                      }

                      return (
                        <React.Fragment key={uniqueId()}>
                          {preElValue}
                          {el}
                          {postElvalue + " "}
                        </React.Fragment>
                      );
                    });
                  })()}
                </Text>
              ) : (
                <Input.TextArea
                  autoSize
                  placeholder="Enter alternate strategy"
                />
              )}
            </li>
          </ul>
        </Col>
        <Col span={1}>
          <Popconfirm
            placement="topRight"
            title={
              withChild
                ? "Are you sure you want to delete this strategy and all related details?"
                : "Are you sure you want to delete this alternate strategy?"
            }
            key={uniqueId()}
            onConfirm={() => deleteRow(record.id)}
          >
            <CloseSquareTwoTone
              key={uniqueId()}
              style={{ fontSize: 25, paddingLeft: withChild ? "12px" : "24px" }}
            />
          </Popconfirm>
        </Col>
      </Row>
    </>
  );
};

export default RowItem;
