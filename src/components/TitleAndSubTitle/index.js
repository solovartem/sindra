import React from "react";
import { Row, Col, Typography,Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title ,Text} = Typography;

const TitleAndSubTitle = ({
  title,
  titleLevel,
  subTitle,
  tooltipValue,
  uploadTitle,
  withIcon=true,
}) => {
  return (
    <>
      <Row align='middle' style={{ paddingBottom:'7px'}}> 
          <Title level={titleLevel || 4}  style={{margin:0, paddingRight:'12px'}}> {title} </Title>
      {withIcon &&  <Tooltip title={tooltipValue}>
          <InfoCircleOutlined style={{ fontSize: '13px' }}/>
          </Tooltip>}
      </Row>
      <Row>
        <Text style={{ fontSize:'13px', color:'grey'}} > {subTitle}</Text>
      </Row>
      <Row align='middle' style={{ paddingTop:'15px'}}>
        <Text style={{fontSize:15, margin:0, paddingRight:'12px'}}> {uploadTitle} </Text>
      </Row>
    </>
  );
};

export default TitleAndSubTitle;
