import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import {
  Divider,
  Row,
  Col,
  Typography,
  Input,
  Radio,
  BackTop,
  Checkbox,
} from "antd";
import { debounce, stubTrue } from "lodash";
import { useDispatch } from "react-redux";
import EditableTable from "./components/EditableTable";
import { Creators as EstimationCreators } from "../../redux/actions/estimation";
import { syncTabData, getPriceData } from "../../axios/login";
import TitleAndSubTitle from "../../components/TitleAndSubTitle";
import "./ancilliary.css";

const { Text, Title } = Typography;

const Ancilliary = ({ setTabsHasErrors, validateAnciallary, tabHasErrors }) => {
  const [financialProjectionsNote, setFinancialProjectionsNote] = useState("");
  const [overallComments, setOverallComments] = useState("");
  const [clientServiceAgreement, setClientServiceAgreement] = useState("");
  const [financialPro, setFinancialPro] = useState();
  const [soaResult, setSoaResult] = useState("");
  const dispatch = useDispatch();
  const [requestData, setRequestData] = useState({
    adviserFees: {},
    financialProjections: {
      customNotes: "",
      projections: {
        notRequired: false,
        years5: false,
        years10: false,
        lifetime: false,
      },
    },
    clientServiceAgreement: "",
    soaResult: "",
    overallComments: "",
  });
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };
  const table1Columns = [
    {
      title: "Initial Fees",
      dataIndex: "initialFees",
      editable: true,
      width: "33%",
    },
    {
      title: "Amount (fixed dollar or percentage)",
      dataIndex: "amount",
      editable: true,
      width: "33%",
    },
    {
      title: "To be funded from",
      dataIndex: "fundedFrom",
      editable: true,
      width: "33%",
    },
  ];
  const table1DataSource = [
    {
      key: 0,
      initialFees: "SOA Preparation Fee",
    },
    {
      key: 1,
      initialFees: "Implementation Fee",
    },
  ];
  const table2Columns = [
    {
      title: "Ongoing Fees",
      dataIndex: "ongoingFees",
      editable: true,
      width: "33%",
    },
    {
      title: "Amount (fixed dollar or percentage)",
      dataIndex: "amount",
      editable: true,
      width: "33%",
    },
    {
      title: "To be funded from",
      dataIndex: "fundedFrom",
      editable: true,
      width: "33%",
    },
  ];
  const table2DataSource = [
    {
      key: 0,
      ongoingFees: "Ongoing Adviser Service Fee",
    },
    {
      key: 1,
      ongoingFees: "Ongoing Commision / Trail",
    },
  ];
  const dispatchDebounce = useRef(debounce(execFunc => execFunc(), 2000))
    .current;
  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (validateInfo(requestData)) {
      dispatchDebounce(async () => {
        await syncTabData({ tab: "ancilliary", tableData: { ...requestData } });
        getPriceData()
          .then(res => res.data)
          .then(data => {
            dispatch(EstimationCreators.updateEstimation(data));
          });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestData]);

  function validateInfo(data) {
    // const targetRow1 = data?.adviserFees?.initialFees && data?.adviserFees?.initialFees[0];
    // const targetRow2 = data?.adviserFees?.ongoingFees && data?.adviserFees?.ongoingFees[0];
    // const tableNotValid =
    //   !targetRow1?.initialFees ||
    //   !targetRow1?.amount ||
    //   !targetRow1?.fundedFrom ||
    //   !targetRow2?.amount ||
    //   !targetRow2?.ongoingFees ||
    //   !targetRow2?.fundedFrom ||
    //   !Object.values(data.financialProjections.projections).includes(true) ||
    //   !data.soaResult ||
    //   data.clientServiceAgreement === "";
    const tableNotValid =
      !Object.values(data.financialProjections.projections).includes(true) ||
      !data.soaResult ||
      data.clientServiceAgreement === "";
    return !tableNotValid;
  }

  const handleTableChange = ({ table, rows }) => {
    const { adviserFees } = requestData;
    const newData = Object.assign({
      ...requestData,
      adviserFees: {
        ...adviserFees,
        [table]: rows,
      },
    });

    setRequestData(newData);

    if (!checkErrors(newData, false)) {
      setTabsHasErrors(prev => {
        let newPrev = [...prev];
        if (prev.includes("Ancilliary"))
          newPrev.splice(prev.indexOf("Ancilliary"), 1);
        return [...newPrev];
      });
    }
  };

  useEffect(() => {
    validateAnciallary.current = (submit = false) => {
      return checkErrors(requestData, true, submit);
    };
  });
  const checkErrors = async (data, withChangeState, submit = false) => {
    if (
      // Object.keys(data.adviserFees).length === 0 &&
      !financialPro &&
      !soaResult &&
      clientServiceAgreement === "" &&
      !submit
    ) {
      return true;
    }
    // const targetRow1 =
    //   data?.adviserFees?.initialFees && data?.adviserFees?.initialFees[0];
    // const targetRow2 =
    //   data?.adviserFees?.ongoingFees && data?.adviserFees?.ongoingFees[0];

    if (
      // !targetRow1?.initialFees ||
      // !targetRow1?.amount ||
      // !targetRow1?.fundedFrom ||
      // !targetRow2?.amount ||
      // !targetRow2?.ongoingFees ||
      // !targetRow2?.fundedFrom ||
      // !Object.values(data.financialProjections.projections).includes(true) ||
      // !data.soaResult ||
      // data.clientServiceAgreement === ""
      !Object.values(data.financialProjections.projections).includes(true) ||
      !data.soaResult ||
      data.clientServiceAgreement === ""
    ) {
      if (withChangeState) {
        setTabsHasErrors(prev =>
          prev.includes("Ancilliary") ? prev : [...prev, "Ancilliary"]
        );
      }
      return true;
    }
    if (withChangeState) {
      setTabsHasErrors(prev => {
        let newPrev = [...prev];
        if (prev.includes("Ancilliary"))
          newPrev.splice(prev.indexOf("Ancilliary"), 1);
        return [...newPrev];
      });
    }
    return false;
  };

  const onClientServiceChange = event => {
    const value = event.target.value;
    setClientServiceAgreement(value);
    const newData = Object.assign({
      ...requestData,
      clientServiceAgreement: value,
    });
    setRequestData(newData);
    checkErrors(newData, false);
  };
  const onSoaResultChange = event => {
    const value = event.target.value;
    setSoaResult(value);
    const newData = Object.assign({
      ...requestData,
      soaResult: value,
    });
    setRequestData(newData);
    checkErrors(newData, false);
  };
  const onFinancialProjectionsChange = event => {
    const value = event.target.value;
    setFinancialProjectionsNote(value);
    const newData = Object.assign({
      ...requestData,
      financialProjections: {
        ...requestData.financialProjections,
        customNotes: value,
      },
    });
    setRequestData(newData);
    checkErrors(newData, false);
  };

  const onOverallCommentsChange = event => {
    const value = event.target.value;
    setOverallComments(value);
    const newData = Object.assign({
      ...requestData,
      overallComments: value,
    });
    setRequestData(newData);
    // checkErrors(newData, true);
  };

  const onChange = e => {
    const value = e.target.value;
    setFinancialPro(value);

    setRequestData(state => {
      let newProjections = { ...state.financialProjections.projections };
      const availableProjections = [
        "notRequired",
        "years5",
        "years10",
        "lifetime",
      ];
      availableProjections.forEach(name => {
        newProjections[name] = value === name;
      });

      const newData = Object.assign({
        ...state,
        financialProjections: {
          ...state.financialProjections,
          projections: newProjections,
        },
      });
      return newData;
    });
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <TitleAndSubTitle
            title={"Adviser Fees"}
            subTitle={
              "Include initial and ongoing adviser fees in the tables below"
            }
            tooltipValue={"xyz"}
            withIcon={false}
          />
        </Col>
        <Col span={24}>
          {/* <Text style={{ color: '#727272' }}>
            Investments
          </Text> */}
        </Col>
        <br />
        <Col span={24}>
          <EditableTable
            columns={table1Columns}
            data={table1DataSource}
            table="initialFees"
            title="Initial Fee"
            handleTableChange={handleTableChange}
            tabHasErrors={tabHasErrors}
          />
          <br />
          <br />
          <EditableTable
            columns={table2Columns}
            data={table2DataSource}
            table="ongoingFees"
            title="Ongoing Fee"
            handleTableChange={handleTableChange}
            tabHasErrors={tabHasErrors}
          />
          <br />
          <br />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <Title level={4}>Financial Projections</Title>
          <div className="financial-projections-wrapper">
            <Radio.Group onChange={onChange} value={financialPro}>
              <Radio value="notRequired">Not required</Radio>
              <Radio value="years5">5 years</Radio>
              <Radio value="years10">10 years</Radio>
              <Radio value="lifetime">Life expectancy</Radio>
            </Radio.Group>
            {tabHasErrors && !financialPro && (
              <div className="error">
                Indicate if any Financial Projections should be completed
              </div>
            )}
          </div>
        </Col>
        <Col span={24}>
          <Text style={{ color: "#727272" }}>
            If you would like to add any custom notes regarding financial
            projections, please add that below
          </Text>
        </Col>
        <br />
        <br />
        <Col span={15}>
          <Input.TextArea
            value={financialProjectionsNote}
            rows={3}
            placeholder="Provide details here"
            onChange={onFinancialProjectionsChange}
          />
        </Col>
      </Row>
      <br />
      <br />
      <Divider />
      <Row>
        <Col span={24}>
          <Title level={4}>Client Service Agreement</Title>
        </Col>
        <br />
        <br />
        <Col span={10}>
          <Radio.Group
            onChange={onClientServiceChange}
            value={clientServiceAgreement}
          >
            <Radio style={radioStyle} value={"CSA offered or in place"}>
              CSA offered or in place
            </Radio>
            <Radio style={radioStyle} value={"No CSA and no review scheduled"}>
              No CSA and no review scheduled
            </Radio>
            <Radio style={radioStyle} value={"No CSA, review paid in arrears"}>
              No CSA, review paid in arrears
            </Radio>
          </Radio.Group>
          {tabHasErrors && clientServiceAgreement === "" && (
            <div className="error">
              Indicate if a Client Service Agreemeent is in place
            </div>
          )}
        </Col>
      </Row>
      <br />
      <br />
      <Divider />
      <Row>
        <Col span={24}>
          <Title level={4}>
            Is this SoA a result of a Portfolio or Insurance Review under a CSA
          </Title>
        </Col>
        <br />
        <br />
        <Col span={10}>
          <Radio.Group onChange={onSoaResultChange} value={soaResult}>
            <Radio style={radioStyle} value={"no"}>
              No
            </Radio>
            <Radio style={radioStyle} value={"portfolio"}>
              Yes - Portfolio Review
            </Radio>
            <Radio style={radioStyle} value={"insurance"}>
              Yes - Insurance Review
            </Radio>
          </Radio.Group>
          {tabHasErrors && !soaResult && (
            <div className="error">
              Indicate if this SoA is the result of a Portfolio or Insurance
              Review under a CSA
            </div>
          )}
        </Col>
      </Row>
      <br />
      <br />
      <Divider />
      <Row>
        <Col span={24}>
          <Title level={4}>Overall Comments</Title>
        </Col>
        <br />
        <br />
        <Col span={15}>
          <Input.TextArea
            value={overallComments}
            rows={3}
            placeholder="Add comments here"
            onChange={onOverallCommentsChange}
          />
        </Col>
      </Row>
      <BackTop />
    </>
  );
};

export default Ancilliary;
