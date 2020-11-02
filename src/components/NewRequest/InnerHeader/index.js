import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Breadcrumb, Typography, Button, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getEstCost,
  getEstCompletion,
} from "../../../redux/selectors/estimation";
import { submitInfo } from "../../../axios/login";
import { Feedback } from "../../Feedback";
import "./index.css";

const { Text, Title } = Typography;

const NewRequestInnerHeader = ({
  cost,
  completion,
  isError,
  validateRef,
  soaId,
}) => {
  const [loading, setLoading] = useState(false);
  const [showFeedback, toggleFeedback] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState(null);
  const [localCost, setLocalCost] = useState(cost);
  const [localCompletion, setLocalCompletion] = useState(completion);

  useEffect(() => {
    const el = document.getElementsByClassName("fade-text");
    if (el.length) {
      Array.from(el).forEach(e => {
        if (e.classList.contains("initial-load")) {
          e.classList.remove("initial-load");
        } else {
          e.className += " fade-out";
          // e.className = e.className.replace('fade-in', 'fade-out');
          setTimeout(() => {
            e.className = e.className.replace("fade-out", "fade-in");
            setLocalCost(cost);
            setLocalCompletion(completion);
          }, 1400);
        }
      });
    }
  }, [cost, completion]);

  const handleSubmitInfo = async () => {
    await validateRef.current();
    if (isError.current) {
      return notification.error({
        message: "Incomplete form",
        description:
          "Please complete all required fields to submit your digital request",
      });
    } else {
      setLoading(true);
      submitInfo()
        .then(res => {
          toggleFeedback(true);
          setFeedbackEmail(res.email);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <>
      {showFeedback && (
        <Feedback
          showFeedbackModal={showFeedback}
          feedbackEmail={feedbackEmail}
        />
      )}
      <Row
        style={{
          backgroundColor: "white",
          height: "auto",
          padding: "10px 50px",
        }}
      >
        <Col span={24}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>SoA</Breadcrumb.Item>
            {soaId && <Breadcrumb.Item>{soaId}</Breadcrumb.Item>}
          </Breadcrumb>
        </Col>
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <div style={{ position: "absolute", left: 0 }}>
            <Title level={3}>SoA Request Form</Title>
          </div>
          <div>
            <Text>Est. cost: </Text>
            <Text
              className="fade-text initial-load"
              style={{ marginRight: "20px" }}
              strong
            >
              {localCost}
            </Text>
            <Text>Est. completion: </Text>
            <Text className="fade-text initial-load" strong>
              {localCompletion}
            </Text>
          </div>
        </Col>
        {/* <Col span={5} style={{ textAlign: 'right' }}>
          <Text>Est. cost: </Text>
          <Text strong>${cost}</Text>
        </Col>
        <Col span={5} style={{ textAlign: 'right' }}>
          <Text>Est. completion: </Text>
          <Text strong>{completion} days</Text>
        </Col> */}
        <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ position: "absolute", left: 0 }}>
            <Text>Digitally sign and submit your SoA request form</Text>
          </div>
          <div>
            <Button
              icon={<UploadOutlined />}
              type="primary"
              onClick={() => handleSubmitInfo()}
              loading={loading}
            >
              Submit Form
            </Button>
          </div>
        </Col>
      </Row>
      <br />
    </>
  );
};

const mapStateToProps = state => ({
  cost: getEstCost(state),
  completion: getEstCompletion(state),
});

export default connect(mapStateToProps, null)(NewRequestInnerHeader);
