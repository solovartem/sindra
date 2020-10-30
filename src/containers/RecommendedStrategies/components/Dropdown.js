import React, { useEffect, useState } from "react";
import { uniqueId, isEmpty, isObject, isString } from "lodash";
import { Menu, Dropdown, Typography, Row, Col, Tooltip } from "antd";
import { PlusSquareTwoTone } from "@ant-design/icons";
import { doesPartnerExist } from "../../../utils/common";

const { Text } = Typography;
const { SubMenu } = Menu;

const DropdownComponent = ({
  title,
  jsonData = {},
  handleOnDropdownSelect,
  client,
  partner,
}) => {
  const [json, setJson] = useState({});

  useEffect(() => {
    let newJSON = {};
    const clientStringifiedJSON = JSON.stringify(jsonData).replace(
      /%owner%/g,
      client.xplanId || "Client"
    );
    newJSON = Object.assign({}, newJSON, {
      Client: JSON.parse(clientStringifiedJSON),
    });

    const partnerStringifiedJSON = doesPartnerExist(partner)
      ? JSON.stringify(jsonData).replace(
          /%owner%/g,
          partner.xplanId || "Partner"
        )
      : "{}";
    newJSON = Object.assign({}, newJSON, {
      Partner: JSON.parse(partnerStringifiedJSON),
    });

    const jointStringifiedJSON = doesPartnerExist(partner)
      ? JSON.stringify(jsonData).replace(
          /%owner%/g,
          `${client.xplanId || "Client"} and ${partner.xplanId || "Partner"}`
        )
      : "{}";
    newJSON = Object.assign({}, newJSON, {
      Joint: JSON.parse(jointStringifiedJSON),
    });
    setJson(newJSON);
  }, [jsonData]);

  const onOptionClick = (event, elementKey, tempKey, owner) => {
    console.log(owner);
    const formattedKey = elementKey.replace(/ /g, "").toLowerCase();
    handleOnDropdownSelect(
      event.item.props.value,
      formattedKey,
      tempKey,
      owner
    );
  };

  const generateDropdownComponent = (
    element,
    elementKey,
    fKey,
    disableFields = false
  ) => {
    if (isObject(element)) {
      const keys = Object.keys(element);
      let component = [];
      for (var i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (isString(element[key].text) && disableFields) {
          component.push(
            <Menu.Item
              key={uniqueId()}
              disabled={disableFields}
              onClick={event =>
                onOptionClick(
                  event,
                  element[key].key,
                  `${elementKey}.${key}`,
                  fKey.split(".")[0]
                )
              }
              value={element[key].text}
            >
              <Tooltip title="Please set Partner’s details on the Basic Details tab to create this strategy recommendation.">
                {key}
              </Tooltip>
            </Menu.Item>
          );
        } else if (isString(element[key].text)) {
          component.push(
            <Menu.Item
              key={uniqueId()}
              onClick={event =>
                onOptionClick(
                  event,
                  element[key].key,
                  `${elementKey}.${key}`,
                  fKey.split(".")[0]
                )
              }
              value={element[key].text}
            >
              {key}
            </Menu.Item>
          );
        } else {
          const disable = key.startsWith("Spouse") && doesPartnerExist(partner);
          component.push(
            <SubMenu
              disabled={isEmpty(element[key])}
              key={uniqueId()}
              title={key}
            >
              {generateDropdownComponent(
                element[key],
                key,
                `${elementKey ? elementKey + "." : ""}${key}`,
                disable
              )}
            </SubMenu>
          );
        }
      }
      return [...component];
    } else {
      // let component = [];
      // component.push(<Menu.Item key={uniqueId()} onClick={(event) => onOptionClick(event, element)} value={element[element].text}>{key}</Menu.Item>);
      // return [...component];
    }
  };

  const menu = <Menu key={uniqueId()}>{generateDropdownComponent(json)}</Menu>;

  return (
    <React.Fragment key={uniqueId()}>
      <Row>
        <Col>
          <Dropdown overlay={menu} trigger={["click"]}>
            <a
              href="!#"
              className="ant-dropdown-link"
              onClick={e => e.preventDefault()}
            >
              <PlusSquareTwoTone style={{ fontSize: 23, color: "#062174" }} />
            </a>
          </Dropdown>
        </Col>
        <Col>
          <Text style={{ color: "#525B85", marginLeft: 10 }}>{title}</Text>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DropdownComponent;
