import React from "react";
import { Row, Col, Breadcrumb, Typography } from "antd";
import "./index.css";

const { Text, Title } = Typography;

const LandingInnerHeader = ({
  numUpcomingAppointments = 0,
  numUnreadComments = 0,
  numReadyToPresent = 0,
}) => {
  return (
    <>
      <Row
        style={{
          backgroundColor: "white",
          height: "auto",
          padding: "10px 50px 50px",
        }}
      >
        <Col span={24}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Soa Application</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8}>
          <Title level={3}>SoA Dashboard</Title>
          <Text>View the status of all SoA Aplications.</Text>
        </Col>
        <Col span={16}>
          <Row justify="end">
            <Col className="landing-stats">
              <Title level={2}>{numUpcomingAppointments}</Title>
              <Text>
                Upcomming <br />
                Appointments
              </Text>
            </Col>
            <Col className="landing-stats">
              <Title level={2}>{numUnreadComments}</Title>
              <Text>
                Unread <br /> Comments
              </Text>
            </Col>
            <Col className="landing-stats">
              <Title level={2}>{numReadyToPresent}</Title>
              <Text>
                Ready
                <br /> to Present
              </Text>
            </Col>
          </Row>
        </Col>
      </Row>
      <br />
    </>
  );
};

export default LandingInnerHeader;
