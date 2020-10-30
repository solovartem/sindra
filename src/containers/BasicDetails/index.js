import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { connect } from "react-redux";
import { debounce, isEmpty, isEqual } from "lodash";
import moment from "moment";
import {
  Row,
  Col,
  Typography,
  Divider,
  DatePicker,
  Input,
  Form,
  Select,
  Checkbox,
  Radio,
  Tooltip,
  Popconfirm,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Creators } from "../../redux/actions/basicDetails";
import { Creators as EstimationCreators } from "../../redux/actions/estimation";
import { syncTabData, getPriceData } from "../../axios/login";
import TitleAndSubTitle from "../../components/TitleAndSubTitle";
import "./index.css";

const { Text } = Typography;
const { Option } = Select;
const initialData = {
  soaRequest: {
    appointmentDate: null,
    serviceOffering: "basic",
    updateFactFindWizard: false,
    serviceRequestWriting: false,
    complianceChecklist: false,
  },
  client: {
    // salutation: '',
    firstName: "",
    lastName: "",
    // xplanId: "",
  },
  partner: {
    // salutation: '',
    firstName: "",
    lastName: "",
    // xplanId: "",
  },
};
const BasicDetails = ({
  dispatch,
  setTabsHasErrors,
  tabHasErrors,
  validateBasicDetails,
}) => {
  const [form] = Form.useForm();
  const [isAppointmentDate, setIsAppointmentDate] = useState(true);

  useEffect(() => {
    validateBasicDetails.current = (submit = false) => {
      return validateInfo(submit);
    };
  });
  // const dateFormat = 'YYYY/MM/DD';
  const dateFormat = "dddd, D MMMM yyyy";
  const [basicDetailValues, setBasicDetailValues] = useState({
    soaRequest: {
      appointmentDate: null,
      serviceOffering: "basic",
      updateFactFindWizard: false,
      serviceRequestWriting: false,
      complianceChecklist: false,
    },
    client: {
      // salutation: '',
      firstName: "",
      lastName: "",
      // xplanId: "",
    },
    partner: {
      // salutation: '',
      firstName: "",
      lastName: "",
      // xplanId: "",
    },
  });
  const dispatchDebounce = useRef(debounce(execFunc => execFunc(), 2000))
    .current;
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (basicDetailValues.soaRequest.serviceOffering === "premium") {
      setBasicDetailValues(prev => {
        let newData = { ...prev };
        newData.soaRequest.serviceRequestWriting = true;
        return { ...newData };
      });
    }
  }, [basicDetailValues.soaRequest.serviceOffering]);

  useEffect(() => {
    if (!checkErrors()) {
      setTabsHasErrors(prev => {
        if (prev.includes("Basic Details"))
          prev.splice(prev.indexOf("Basic Details"), 1);
        return [...prev];
      });
    } else {
    }
  }, [
    basicDetailValues.soaRequest.appointmentDate,
    basicDetailValues.soaRequest.serviceOffering,
    basicDetailValues.client.firstName,
    basicDetailValues.client.lastName,
    // basicDetailValues.client.xplanId,
    isAppointmentDate,
  ]);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    dispatchDebounce(async () => {
      dispatch(Creators.updateBasicDetails(basicDetailValues));
      // if (!checkErrors()) {
      await syncTabData({
        tab: "basicdetails",
        tableData: { ...basicDetailValues },
      });
      getPriceData()
        .then(res => res.data)
        .then(data => {
          dispatch(EstimationCreators.updateEstimation(data));
        });
      // }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicDetailValues]);

  useEffect(() => {
    if (!isAppointmentDate) {
      setBasicDetail("soaRequest", {
        ...basicDetailValues.soaRequest,
        appointmentDate: JSON.stringify(null),
      });
    }
  }, [isAppointmentDate]);

  function checkErrors() {
    return (
      (isAppointmentDate && !basicDetailValues.soaRequest.appointmentDate) ||
      !basicDetailValues.soaRequest.serviceOffering ||
      // !basicDetailValues.client.xplanId ||
      !basicDetailValues.client.firstName ||
      !basicDetailValues.client.lastName
    );
  }
  async function validateInfo(submit = false) {
    if (!isEqual(basicDetailValues, initialData) || submit) {
      return sendValidationToParent();
    }
    return false;
  }

  function sendValidationToParent() {
    return form
      .validateFields()
      .then(res => {
        setTabsHasErrors(prev => {
          if (prev.includes("Basic Details"))
            prev.splice(prev.indexOf("Basic Details"), 1);
          return prev;
        });
        return false;
      })
      .catch(err => {
        setTabsHasErrors(prev =>
          prev.includes("Basic Details") ? prev : [...prev, "Basic Details"]
        );

        return true;
      });
  }

  const setBasicDetail = (key, value) => {
    setBasicDetailValues({
      ...basicDetailValues,
      [key]: value,
    });
  };

  return (
    <>
      <Form form={form} initialValues={{ serviceOffering: "basic" }}>
        {/* Basic Details Heading: Change if needed */}
        <TitleAndSubTitle
          title={"Basic Details"}
          subTitle={"Details about your request"}
          tooltipValue={"Details about your Client and Partner"}
        />
        <br />
        <Row>
          <Col span={8}>
            <Form.Item>
              <Text strong>Client's Basic Details</Text>
            </Form.Item>
            <Form.Item
              label="First Name:"
              name="First Name:"
              rules={[
                {
                  required: true,
                  message: "This is a required field",
                },
              ]}
              style={{ width: "100%" }}
            >
              <Input
                placeholder="type first name here"
                style={
                  tabHasErrors && !form.getFieldValue("First Name:")
                    ? { border: "2px solid red", width: "100%" }
                    : { width: "100%" }
                }
                onChange={event =>
                  setBasicDetail("client", {
                    ...basicDetailValues.client,
                    firstName: event.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item
              label="Last Name:"
              name="Last Name:"
              rules={[
                {
                  required: true,
                  message: "This is a required field",
                },
              ]}
              style={{ width: "100%" }}
            >
              <Input
                placeholder="type last name here"
                style={
                  tabHasErrors && !form.getFieldValue("Last Name:")
                    ? { border: "2px solid red", width: "100%" }
                    : { width: "100%" }
                }
                onChange={event =>
                  setBasicDetail("client", {
                    ...basicDetailValues.client,
                    lastName: event.target.value,
                  })
                }
              />
            </Form.Item>
            {/* <Form.Item
              label="Xplan ID:"
              name="Xplan ID:"
              rules={[
                {
                  required: true,
                  message: "This is a required field",
                },
              ]}
              style={{ width: "100%" }}
            >
              <Input
                placeholder="Enter Client’s Xplan ID"
                style={
                  tabHasErrors && !form.getFieldValue("Xplan ID:")
                    ? { border: "2px solid red", width: "100%" }
                    : { width: "100%" }
                }
                onChange={event =>
                  setBasicDetail("client", {
                    ...basicDetailValues.client,
                    xplanId: event.target.value,
                  })
                }
              />
            </Form.Item> */}
          </Col>
          <Col span={8} offset={3}>
            <Form.Item>
              <Text strong>Partner's Basic Details </Text>{" "}
              <Tooltip
                title={
                  "Specify Partner details to make Investment, Insurance and Strategy recommendations"
                }
              >
                <InfoCircleOutlined style={{ fontSize: "13px" }} />
              </Tooltip>
            </Form.Item>
            <Form.Item label="First Name:">
              <Input
                placeholder="type first name here"
                onChange={event =>
                  setBasicDetail("partner", {
                    ...basicDetailValues.partner,
                    firstName: event.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Last Name:">
              <Input
                placeholder="type last name here"
                onChange={event =>
                  setBasicDetail("partner", {
                    ...basicDetailValues.partner,
                    lastName: event.target.value,
                  })
                }
              />
            </Form.Item>
            {/* <Form.Item label="Xplan ID:">
              <Input
                placeholder="Enter Partner’s Xplan ID"
                onChange={event =>
                  setBasicDetail("partner", {
                    ...basicDetailValues.partner,
                    xplanId: event.target.value,
                  })
                }
              />
            </Form.Item> */}
          </Col>
        </Row>
        <br />
        <Divider style={{ marginTop: "12px" }} />
        <br />
        <TitleAndSubTitle
          title={"Requested service"}
          subTitle={"Details about your request"}
          withIcon={false}
        />
        <br />
        <Row>
          <Col span={8}>
            <Row align="middle">
              <Form.Item
                label="Appointment Date:"
                name="Appointment Date:"
                rules={[
                  {
                    required: isAppointmentDate,
                    message: "This is a required field",
                  },
                ]}
                style={{ width: "100%" }}
                className={
                  !isAppointmentDate ? "appointment-date-not-required" : ""
                }
              >
                <DatePicker
                  disabled={!isAppointmentDate}
                  placeholder="Please select date"
                  format={dateFormat}
                  style={
                    tabHasErrors &&
                    !form.getFieldValue("Appointment Date:") &&
                    isAppointmentDate
                      ? { border: "2px solid red", width: "100%" }
                      : { width: "100%" }
                  }
                  onChange={value =>
                    setBasicDetail("soaRequest", {
                      ...basicDetailValues.soaRequest,
                      appointmentDate: moment(value).format(dateFormat),
                    })
                  }
                />
              </Form.Item>
            </Row>
            <Row>
              <Checkbox
                onChange={() => setIsAppointmentDate(prev => !prev)}
                checked={!isAppointmentDate}
              >
                No appointment date
              </Checkbox>
            </Row>
          </Col>

          <Col span={3} offset={3}>
            <Row align="middle">
              <Form.Item
                label="Service Offering"
                name="serviceOffering"
                style={{ width: "100%" }}
              >
                <Radio.Group
                  name="serviceOffering"
                  value={basicDetailValues.soaRequest.serviceOffering}
                  onChange={e => {
                    if (e.target.value !== "basic") {
                      setBasicDetail("soaRequest", {
                        ...basicDetailValues.soaRequest,
                        serviceOffering: e.target.value,
                      });
                    }
                  }}
                >
                  {/* <Popconfirm
                    title="Doing this will clear any data you have entered for investment research requests"
                    okText="Okay"
                    cancelText="Cancel"
                    onConfirm={() => {
                      setBasicDetail(
                        "soaRequest",
                        {
                          ...basicDetailValues.soaRequest,
                          serviceOffering: 'basic'
                        }
                      )
                    }}
                    onCancel={() => {
                      setBasicDetail(
                        "soaRequest",
                        {
                          ...basicDetailValues.soaRequest,
                        }
                      )
                    }}
                  >

                  </Popconfirm> */}
                  <Radio value="basic">Basic Package</Radio>{" "}
                  <Tooltip
                    title={
                      "This package is suitable for advisers that have already done product research and confirmed the recommended product."
                    }
                  >
                    <InfoCircleOutlined
                      style={{ fontSize: "13px", paddingLeft: "-10px" }}
                    />
                  </Tooltip>
                  <Radio value="research" disabled={true}>
                    Research+ Package
                  </Radio>
                  <Radio value="premium" disabled={true}>
                    Premium Package
                  </Radio>
                  <Radio value="foundation" disabled={true}>
                    Foundation SoA
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Row>
          </Col>
          <Col span={7} offset={3}>
            <Row>
              <Col>
                <Col>Add-ons:</Col>
                <Checkbox
                  onChange={() =>
                    setBasicDetailValues(prev => {
                      let newData = { ...prev };
                      newData.soaRequest.updateFactFindWizard = !newData
                        .soaRequest.updateFactFindWizard;
                      return { ...newData };
                    })
                  }
                  checked={basicDetailValues.soaRequest.updateFactFindWizard}
                >
                  Update Fact Find Wizard
                </Checkbox>
                <br />
                <Checkbox
                  onChange={() =>
                    setBasicDetailValues(prev => {
                      let newData = { ...prev };
                      newData.soaRequest.complianceChecklist = !newData
                        .soaRequest.complianceChecklist;
                      return { ...newData };
                    })
                  }
                  checked={basicDetailValues.soaRequest.complianceChecklist}
                >
                  Compliance Checklist
                </Checkbox>
                <br />
                <Checkbox
                  onChange={() =>
                    setBasicDetailValues(prev => {
                      let newData = { ...prev };
                      newData.soaRequest.serviceRequestWriting = !newData
                        .soaRequest.serviceRequestWriting;
                      return { ...newData };
                    })
                  }
                  checked={basicDetailValues.soaRequest.serviceRequestWriting}
                  disabled
                >
                  Service Request Writing
                </Checkbox>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(BasicDetails);
