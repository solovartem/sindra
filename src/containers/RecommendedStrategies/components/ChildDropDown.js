import React, { useEffect, useMemo, useState } from "react";
import { uniqueId } from "lodash";
import { Menu, Dropdown, Typography, Row, Col } from "antd";
import { PlusSquareTwoTone } from "@ant-design/icons";

const { Text } = Typography;

const ChildDropdownComponent = ({ title, handleOnDropdownSelect }) => {
  return (
    <React.Fragment key={uniqueId()}>
      <Row>
        <Col>
          <i onClick={handleOnDropdownSelect}>
            <PlusSquareTwoTone
              style={{ fontSize: 23, color: "#062174", cursor: "pointer" }}
            />
          </i>
        </Col>
        <Col>
          <Text style={{ color: "#525B85", marginLeft: 10 }}>{title}</Text>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ChildDropdownComponent;
