import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  Input,
  InputNumber,
  Row,
  Col,
  Select,
  Table,
  Divider,
  Typography,
  Button,
  Upload,
  Progress,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { isEmpty, debounce, isEqual, cloneDeep, sortBy } from "lodash";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { getPriceData, syncTabData } from "../../../axios/login";
import { Creators as EstimationCreators } from "../../../redux/actions/estimation";
import TitleAndSubTitle from "../../../components/TitleAndSubTitle";
import { connect } from "react-redux";
import { getServiceOffering } from "../../../redux/selectors/basicDetails";
import { getInsuranceProducts } from "../../../axios/insuranceTable";
import { postDocument } from "../../../axios/insuranceTable";
import "./../index.css";
import { doesClientExist, doesPartnerExist } from "../../../utils/common";
import usePrevious from "../../../hooks/usePrevious";
const { Text } = Typography;
const { Option, OptGroup } = Select;

const TableComponent = ({
  handlePostTable,
  isAddTablePending,
  tableId,
  tableData, // if we fetch table infos from API
  client,
  partner,
  serviceOffering,
  validateInsurance,
  setTabsHasErrors,
  dispatch,
}) => {
  const [numRows, setNumRows] = useState(2);
  const [numColumns, setNumColumns] = useState(3);
  const prevNumColumns = usePrevious(numColumns);

  const [fileList, setFileList] = useState({
    "Policy 1": [],
    "Policy 2": [],
    "Policy 3": [],
  });
  const [quotesFileList, setQuotesFileList] = useState({
    "Policy 1": [],
    "Policy 2": [],
    "Policy 3": [],
  });
  // structure states
  let formattedSelectedDropdownValue = {};
  let formattedPortfolioValues = {};
  let formattedTableValues = [];

  const columns = Array(numColumns)
    .fill("")
    .map((item, index) => `Policy ${index + 1}`);

  columns.forEach(item => {
    formattedPortfolioValues[item] = "";
    let selectedDropdownValueItem = {};
    let newTableValuesItem = {
      targetProduct: "",
      policy: item,
      owner: "",
      valueOfNewPortfolio: "",
      recomendationType: "",
      alternativeQuotes: null,
      policyDetails: {
        selected: "",
        otherName: null,
        customFiles: null,
      },
      additionalComment: "",
    };

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      selectedDropdownValueItem[`policy${rowIndex + 1}ToConsider`] = "";
      newTableValuesItem[`policy${rowIndex + 1}ToConsider`] = {
        policyId: undefined,
        customValue: undefined,
      };
    }
    formattedSelectedDropdownValue[item] = selectedDropdownValueItem;
    formattedTableValues = [...formattedTableValues, newTableValuesItem];
  });

  const [tableValues, setTableValues] = useState(
    tableData || cloneDeep(formattedTableValues)
  );
  const [tableValuesRef, setTableValuesRef] = useState(
    cloneDeep(formattedTableValues)
  );
  const [policiesWithErrors, setPoliciesWithErrors] = useState([]);
  const [newPortfolioValue, setNewPortfolioValue] = useState(
    formattedPortfolioValues
  );
  const [newDropdownValue, setNewDropdownValue] = useState();

  const [selectedDropdownValue, setSelectedDropdownValue] = useState(
    formattedSelectedDropdownValue
  );

  const dropdownRef = useRef();
  const dispatchDebounce = useRef(debounce(execFunc => execFunc(), 2000))
    .current;
  const firstUpdate = useRef(true);
  useEffect(() => {
    validateInsurance.current = () => {
      return validateInfo();
    };
  });

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    dispatchDebounce(() => handlePostTable(tableId, tableValues));

    let payload = sortBy(tableValues, "policy");
    console.log("PAYLOAD", payload);

    const response = payload.map(p => {
      return {
        targetProduct: p.targetProduct,
        owner: p.owner,
        recomendationType: p.recomendationType,
        alternativeQuotes: p.alternativeQuotes,
        additionalComment: p.additionalComment,
        policyDetails: p.policyDetails,
      };
    });
    let shouldDispatch = false;

    for (let i = 0; i < tableValues.length; i++) {
      let data = tableValues[i];
      if (
        !isEqual(
          data,
          tableValuesRef.find(item => item.policy === data.policy)
        )
      ) {
        if (
          data.policyDetails?.selected &&
          data.owner &&
          data.recomendationType &&
          data.targetProduct
        ) {
          shouldDispatch = true;
          console.log(data.targetProduct);
        } else {
          shouldDispatch = false;
          break;
        }
      }
    }

    let filteredResponse = response.filter(
      p =>
        p.policyDetails?.selected &&
        p.owner &&
        p.recomendationType &&
        p.targetProduct
    );
    console.log("Response", filteredResponse);

    dispatchDebounce(async () => {
      if (shouldDispatch) {
        await syncTabData({
          tab: "insurance",
          tableData: { ...filteredResponse },
        });
        getPriceData()
          .then(res => res.data)
          .then(data => {
            dispatch(EstimationCreators.updateEstimation(data));
          });
      }
    });

    // For scroll to left on adding a new column.
    // Compares prev no. of columns with current no.
    // and sets the scroll left accordingly

    if (numColumns > prevNumColumns) {
      const ref = document.querySelector(".ant-table-content");
      ref.scrollLeft = ref.scrollWidth - ref.getBoundingClientRect().width;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableValues]);

  const validateInfo = async () => {
    let policiesWithErrors = [];
    tableValues.forEach((data, index) => {
      if (
        !isEqual(
          data,
          tableValuesRef.find(item => item.policy === data.policy)
        )
      ) {
        if (
          !data.policyDetails?.selected ||
          !data.owner ||
          !data.recomendationType ||
          !data.targetProduct
        ) {
          policiesWithErrors = [...policiesWithErrors, data.policy];
        }
      }
    });
    setPoliciesWithErrors(policiesWithErrors);
    if (!policiesWithErrors.length) {
      setTabsHasErrors(prev => {
        let newPrev = [...prev];
        if (prev.includes("Insurance Products"))
          newPrev.splice(prev.indexOf("Insurance Products"), 1);
        return [...newPrev];
      });
    } else {
      setTabsHasErrors(prev =>
        prev.includes("Insurance Products")
          ? prev
          : [...prev, "Insurance Products"]
      );
    }
    return policiesWithErrors.length; //TODO: will be edited
  };

  const getValueForComponent = (policy, field, component) => {
    const currentPolicy = tableValues.find(x => x.policy === policy);
    if (component === "PolicyToConsider") {
      return (
        currentPolicy[field]["policyId"] || currentPolicy[field]["customValue"]
      );
    }
    return currentPolicy[field];
  };

  // const onNewPortfolioValueChange = (policy, value) => {
  //   setTableValue(policy, "portfolioValue", value);
  //   setNewPortfolioValue({
  //     ...newPortfolioValue,
  //     [policy]: value,
  //   });
  // };

  // const onNewDropdownValueChange = event => {
  //   setNewDropdownValue(event.target.value);
  // };

  // const addNewDropdownOption = (policy, fieldValue) => {
  //   if (!isEmpty(newDropdownValue)) {
  //     setSelectedDropdownValue({
  //       ...selectedDropdownValue,
  //       [policy]: {
  //         ...selectedDropdownValue[policy],
  //         [fieldValue]: newDropdownValue,
  //       },
  //     });
  //     onPolicyConsiderChange(policy, newDropdownValue, fieldValue);
  //     dropdownRef.current.focus();
  //     setNewDropdownValue("");
  //   }
  // };

  // const onPolicyConsiderChange = (policy, value, fieldValue) => {
  //   let newConsider = {};

  //   if (value.startsWith("_")) {
  //     newConsider = {
  //       customValue: value.substring(1, value.length),
  //       policyId: undefined,
  //     };
  //   } else {
  //     newConsider = {
  //       customValue: undefined,
  //       policyId: value,
  //     };
  //   }

  //   setTableValue(policy, fieldValue, newConsider);
  // };

  const validateFields = policy => () => {
    if (policiesWithErrors.includes(policy)) validateInfo();
  };

  const setTableValue = (policy, key, value) => {
    const currentPolicyIndex = tableValues.findIndex(x => x.policy === policy);

    const currentPolicy = tableValues.find(x => x.policy === policy) || {};
    let newPolicy = Object.assign(currentPolicy, { [key]: value });

    setTableValues([
      ...tableValues.slice(0, currentPolicyIndex),
      newPolicy,
      ...tableValues.slice(currentPolicyIndex + 1),
    ]);
  };

  const OwnerComponent = policy => {
    return (
      <Select
        showSearch
        value={getValueForComponent(policy, "owner")}
        onChange={value => setTableValue(policy, "owner", value)}
        onBlur={validateFields(policy, "owner")}
        style={
          policiesWithErrors.includes(policy) &&
          !getValueForComponent(policy, "owner")
            ? { border: "2px solid red", width: "100%" }
            : { width: "100%" }
        }
      >
        <Option value="client">
          Client {doesClientExist(client) ? `(${client.firstName})` : ""}
        </Option>
        {doesPartnerExist(partner) ? (
          <Option value="partner">Partner ({partner.firstName})</Option>
        ) : null}
        {doesPartnerExist(partner) ? (
          <Option value="joint">Joint</Option>
        ) : null}
      </Select>
    );
  };

  const targetProductComponent = policy => (
    <Input
      value={getValueForComponent(policy, "targetProduct")}
      onChange={event =>
        setTableValue(policy, "targetProduct", event.target.value)
      }
      style={
        policiesWithErrors.includes(policy) &&
        !getValueForComponent(policy, "targetProduct")
          ? { border: "2px solid red", width: "100%" }
          : { width: "100%" }
      }
    />
  );

  // const ValueOfNewPortfolioComponent = (policy) => {
  //   return <InputNumber
  //     defaultValue={newPortfolioValue[policy] || getValueForComponent(policy, 'valueOfNewPortfolio', 'ValueOfNewPortfolio')}
  //     onChange={(value) => onNewPortfolioValueChange(policy, value)}
  //     onBlur={validateFields(policy, 'PolicyToConsider')}
  //     formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
  //     parser={value => value.replace(/\$\s?|(,*)/g, '')}
  //     style={{ width: '100%' }}
  //     />
  // };

  const onPolicyRemove = policy => file => {
    const index = fileList[policy].findIndex(f => f.uid === file.uid);
    if (index !== -1) {
      setFileList(prev => {
        let list = prev[policy];
        return {
          ...prev,
          [policy]: [...list.slice(0, index), ...list.slice(index + 1)],
        };
      });
    }
    let obj = getValueForComponent(policy, "policyDetails");
    const resultIndex = obj.customFiles.findIndex(f => f === file.fileId);
    if (resultIndex !== -1) {
      obj = {
        ...obj,
        customFiles: [
          ...(obj.customFiles || []).slice(0, index),
          ...(obj.customFiles || []).slice(index + 1),
        ],
      };
      setTableValue(policy, "policyDetails", obj);
    }
  };

  const PolicyDetailsComponent = policy => {
    const value = getValueForComponent(policy, "policyDetails").selected;

    const customPolicyRequest = policy => ({ file, onSuccess, onProgress }) => {
      const data = new FormData();
      data.append("file", file, file.fileName);
      let obj = getValueForComponent(policy, "policyDetails");
      const type = "policies";
      const config = {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: event => {
          onProgress({ percent: (event.loaded / event.total) * 100 });
        },
      };
      return postDocument(data, type, config)
        .then(response => {
          file.fileId = response.fileId;
          setFileList(prev => {
            let list = prev[policy];
            return { ...prev, [policy]: [...list, file] };
          });
          obj = {
            ...obj,
            customFiles: [...(obj.customFiles || []), response.fileId],
          };
          console.log(obj);
          setTableValue(policy, "policyDetails", obj);
          onSuccess(response);
          message.success(`${file.fileName} was uploaded succesfully`);
        })
        .catch(err => {
          console.log("insurance error");
          message.error(`Failed to upload ${file.fileName}`);
        });
    };

    return (
      <div>
        <Select
          showSearch
          onChange={value => {
            let obj = {
              selected: value,
              otherName: null,
              customFiles: null,
            };
            setTableValue(policy, "policyDetails", obj);
          }}
          onBlur={validateFields(policy, "policyDetails")}
          defaultValue={value}
          value={getValueForComponent(policy, "policyDetails")?.selected}
          style={
            policiesWithErrors.includes(policy) &&
            !getValueForComponent(policy, "policyDetails").selected
              ? { border: "2px solid red", width: "100%" }
              : { width: "100%" }
          }
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          <Option value="retain">Retain - as per fact find</Option>
          <Option value="vary">Vary - uploaded on Xplan</Option>
          <Option value="new">New - uploaded on Xplan</Option>
        </Select>
        {value === "vary" || value === "new" ? (
          <div>
            <Upload
              fileList={fileList[policy]}
              customRequest={customPolicyRequest(policy)}
              onRemove={onPolicyRemove(policy)}
            >
              <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                Upload document
              </Button>
            </Upload>
          </div>
        ) : null}
      </div>
    );
  };

  const RecommendationTypeComponent = policy => (
    <Select
      showSearch
      onChange={value => setTableValue(policy, "recomendationType", value)}
      value={getValueForComponent(policy, "recomendationType")}
      onBlur={validateFields(policy, "recomendationType")}
      style={
        policiesWithErrors.includes(policy) &&
        !getValueForComponent(policy, "recomendationType")
          ? { border: "2px solid red", width: "100%" }
          : { width: "100%" }
      }
      filterOption={(input, option) =>
        option.toLowerCase().includes(input.toLowerCase())
      }
    >
      <Option value="retain">Retain</Option>
      <Option value="vary">Vary</Option>
      <Option value="new">New</Option>
    </Select>
  );

  const onQuotesRemove = policy => file => {
    const index = quotesFileList[policy].findIndex(f => f.uid === file.uid);
    if (index !== -1) {
      setQuotesFileList(prev => {
        let list = prev[policy];
        return {
          ...prev,
          [policy]: [...list.slice(0, index), ...list.slice(index + 1)],
        };
      });
    }
    let list = getValueForComponent(policy, "alternativeQuotes");
    const resultIndex = list.findIndex(f => f === file.fileId);
    if (resultIndex !== -1) {
      list = [
        ...(list || []).slice(0, index),
        ...(list || []).slice(index + 1),
      ];
      setTableValue(policy, "alternativeQuotes", list);
    }
  };

  const AlternativeQuotesComponent = policy => {
    console.log("Quotes", quotesFileList);

    const customQuotesRequest = policy => ({ file, onSuccess, onProgress }) => {
      const data = new FormData();
      data.append("file", file, file.fileName);
      let list = getValueForComponent(policy, "alternativeQuotes");
      const type = "policies";
      const config = {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: event => {
          onProgress({ percent: (event.loaded / event.total) * 100 });
        },
      };
      return postDocument(data, type, config)
        .then(response => {
          file.fileId = response.fileId;
          setQuotesFileList(prev => {
            let list = prev[policy];
            return { ...prev, [policy]: [...list, file] };
          });
          list = [...(list || []), response.fileId];
          setTableValue(policy, "alternativeQuotes", list);
          onSuccess(response);
          message.success(`${file.fileName} was uploaded succesfully`);
        })
        .catch(err => {
          console.log("insurance error");
          message.error(`Failed to upload ${file.fileName}`);
        });
    };

    return (
      <>
        <Upload
          fileList={quotesFileList[policy]}
          customRequest={customQuotesRequest(policy)}
          onRemove={onQuotesRemove(policy)}
        >
          <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
            Upload document
          </Button>
        </Upload>
      </>
    );
  };

  // const AlternativeQuotesNewComponent = policy => {
  //   return (
  //     <>
  //       <Select
  //         showSearch
  //         onChange={value => setTableValue(policy, "alternativeQuotes", value)}
  //         value={getValueForComponent(policy, "alternativeQuotes")}
  //         onBlur={validateFields(policy, "alternativeQuotes")}
  //         style={{ width: "100%" }}
  //         filterOption={(input, option) =>
  //           option.toLowerCase().includes(input.toLowerCase())
  //         }
  //       >
  //         <Option value="uploadedToXplan">Uploaded to Xplan</Option>
  //         <Option value="notRequired">Not Required</Option>
  //       </Select>
  //     </>
  //   );
  // };

  const renderAdditionalCommentsComponent = policy => (
    <Input
      style={{ width: "100%" }}
      value={getValueForComponent(policy, "additionalComment")}
      onChange={event =>
        setTableValue(policy, "additionalComment", event.target.value)
      }
    />
  );

  const renderColumns = (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    if (row.key === "addNewRow") {
      obj.props.colSpan = 0;
    }
    if (row.key === "Policy Details" || row.key === "Alternative Quotes") {
      obj.props.style = { verticalAlign: "baseline" };
    }

    return obj;
  };

  function renderColumnAddButton(customStyle) {
    return (
      <div style={customStyle ? { ...customStyle } : null}>
        <Button
          type="dashed"
          onClick={() => {
            let tableItem = {
              targetProduct: "",
              owner: "",
              policy: `Policy ${numColumns + 1}`,
              recomendationType: "",
              policyDetails: {
                selected: "",
                otherName: null,
                customFiles: null,
              },
              alternativeQuotes: null,
              valueOfNewPortfolio: "",
              additionalComment: "",
            };
            let selectedDropdownValueItem = {};
            for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
              tableItem[`policy${rowIndex + 1}ToConsider`] = {
                policyId: undefined,
                customValue: undefined,
              };
              selectedDropdownValueItem[`policy${rowIndex + 1}ToConsider`] = "";
            }
            setNewPortfolioValue(prev => {
              prev[`Policy ${numColumns + 1}`] = "";
              return prev;
            });

            setTableValues(prev => {
              return [...prev, { ...tableItem }];
            });
            setTableValuesRef(prev => {
              return [...prev, { ...tableItem }];
            });
            setSelectedDropdownValue(prev => {
              prev[`Policy ${numColumns + 1}`] = selectedDropdownValueItem;
              return prev;
            });

            setNumColumns(prev => prev + 1);
            setQuotesFileList(prev => {
              let policy = `Policy ${numColumns + 1}`;
              return { ...prev, [policy]: [] };
            });
            setFileList(prev => {
              let policy = `Policy ${numColumns + 1}`;
              return { ...prev, [policy]: [] };
            });
          }}
          style={{ height: "100%" }}
        >
          <PlusOutlined /> Add Policy
        </Button>
      </div>
    );
  }

  function renderAddRowButton() {
    return (
      <Button
        type="dashed"
        onClick={() => {
          setTableValues(prev => {
            let newData = [...prev];
            newData.map(item => {
              item[`policy${numRows + 1}ToConsider`] = {
                customValue: undefined,
                policyId: undefined,
              };
              return item;
            });
            return newData;
          });
          setTableValuesRef(prev => {
            let newData = [...prev];
            newData.map(item => {
              item[`policy${numRows + 1}ToConsider`] = {
                customValue: undefined,
                policyId: undefined,
              };
              return item;
            });
            return newData;
          });
          setSelectedDropdownValue(prev => {
            let newData = Object.assign({}, prev);
            Object.keys(prev).forEach(
              item => (newData[item][`policy${numRows + 1}ToConsider`] = "")
            );
            return newData;
          });

          setNumRows(prev => prev + 1);
        }}
        style={{ width: "100%" }}
      >
        <span>
          <PlusOutlined /> Add Policy to consider
        </span>
      </Button>
    );
  }

  const deletePolicy = index => {
    setTableValues(prev => {
      let after = [...prev.slice(index + 1)];
      after.forEach((item, i) => {
        item.policy = `Policy ${index + 1 + i}`;
      });
      console.log([...prev.slice(0, index), ...prev.slice(index + 1)], after);
      return [...prev.slice(0, index), ...after];
    });

    setTableValuesRef(prev => {
      let after = [...prev.slice(index + 1)];
      after.forEach((item, i) => {
        item.policy = `Policy ${index + 1 + i}`;
      });
      return [...prev.slice(0, index), ...after];
    });

    setNumColumns(prev => prev - 1);

    setPoliciesWithErrors(prev => {
      let errorIndex = prev.findIndex(p => p === `Policy ${index + 1}`);
      return [...prev.slice(0, errorIndex), ...prev.slice(errorIndex + 1)];
    });

    setFileList(prev => {
      let keys = [...Object.keys(prev).sort()];

      let deleted = false;

      keys.forEach((key, i) => {
        if (deleted) {
          Object.defineProperty(
            prev,
            `Policy ${i}`,
            Object.getOwnPropertyDescriptor(prev, key)
          );
          delete prev[key];
        }
        if (i === index && !deleted) {
          delete prev[`Policy ${index + 1}`];
          deleted = true;
        }
      });

      return prev;
    });

    setQuotesFileList(prev => {
      let keys = [...Object.keys(prev).sort()];

      let deleted = false;

      keys.forEach((key, i) => {
        if (deleted) {
          Object.defineProperty(
            prev,
            `Policy ${i}`,
            Object.getOwnPropertyDescriptor(prev, key)
          );
          delete prev[key];
        }
        if (i === index && !deleted) {
          delete prev[`Policy ${index + 1}`];
          deleted = true;
        }
      });

      return prev;
    });
  };

  const generateColumns = () => {
    let columns = [
      {
        title: "",
        fixed: "left",
        dataIndex: "firstColumn",
        key: "firstColumn",
        render: (text, row, index) => {
          if (row.key === "addNewRow") {
            return {
              children: text,
              props: {
                colSpan: numColumns + 1,
              },
            };
          }
          return (
            <>
              <Text strong>{text}</Text>
              {text === "Alternative Quotes" ? (
                <>
                  <br />
                  <Text type="secondary">
                    Please upload any additional quotations
                  </Text>
                </>
              ) : null}
            </>
          );
        },
      },
    ];
    for (let colsIndex = 0; colsIndex < numColumns; colsIndex++) {
      columns = [
        ...columns,
        {
          textWrap: "word-break",
          // ellipsis: true,
          // width: 40,
          className: "insurance-platform-column",
          title: () => {
            return (
              <div className="custom-header">
                <span>{`Policy ${colsIndex + 1}`}</span>
                <span className="policy-delete-btn">
                  <Popconfirm
                    title="Are you sure you want to delete this insurance policy?"
                    onConfirm={() => {
                      console.log(colsIndex);
                      deletePolicy(colsIndex);
                    }}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button icon={<DeleteOutlined />} type="text" />
                  </Popconfirm>
                </span>
              </div>
            );
          },
          dataIndex: `policy${colsIndex + 1}`,
          key: `policy${colsIndex + 1}`,
          render: renderColumns,
        },
      ];
    }
    columns = [
      ...columns,
      {
        textWrap: "word-break",
        ellipsis: true,
        key: `addColumn`,
        dataIndex: "addColumn",
        fixed: "right",
        className: "insurance-add-platform-column",
        render: (text, row, index) => {
          return {
            children: text,
            props: {
              rowSpan: row.key === "targetProduct" ? numRows + 5 : 0,
            },
          };
        },
      },
    ];
    return columns;
  };

  const generateRows = () => {
    function mapFuncToValues(func) {
      let item = {};
      for (let colsIndex = 0; colsIndex < numColumns; colsIndex++) {
        item[`policy${colsIndex + 1}`] = func(`Policy ${colsIndex + 1}`);
      }
      return item;
    }
    let staticRows = [
      {
        key: "addNewRow",
        firstColumn: renderAddRowButton(),
      },
      // {
      // key: 'Value of new portfolio',
      // firstColumn: 'Value of new portfolio',
      // ...mapFuncToValues(ValueOfNewPortfolioComponent)
      // },

      {
        key: "Recommendation Type",
        firstColumn: "Recommendation Type",
        ...mapFuncToValues(RecommendationTypeComponent),
      },

      {
        key: "Policy Details",
        firstColumn: "Policy Details",
        ...mapFuncToValues(PolicyDetailsComponent),
      },
      {
        key: "Alternative Quotes",
        firstColumn: "Alternative Quotes",
        ...mapFuncToValues(AlternativeQuotesComponent),
      },
      // {
      //   key: "Alternative Quotes",
      //   firstColumn: "Alternative Quotes",
      //   ...mapFuncToValues(AlternativeQuotesNewComponent),
      // },
      {
        key: "Additional comments",
        firstColumn: "Additional comments",
        ...mapFuncToValues(renderAdditionalCommentsComponent),
      },
    ];

    let data = [
      {
        key: "targetProduct",
        firstColumn: "Name of Policy",
        ...mapFuncToValues(targetProductComponent),
        addColumn: renderColumnAddButton({ transform: "rotate(90deg)" }),
      },
      {
        key: "Owner",
        firstColumn: "Owner",
        ...mapFuncToValues(OwnerComponent),
      },
    ];

    staticRows = staticRows.slice(1);
    return [...data, ...staticRows];
  };

  return (
    <>
      <TitleAndSubTitle
        title={"Insurance recommendations"}
        subTitle={"Complete the table below"}
        withIcon={false}
      />
      <Table
        // size='small'
        scroll={{ x: true }}
        title={() => (
          <Row>
            <Col span={22}>
              <Text strong>{tableId ? `Table ID: ${tableId}` : null}</Text>
            </Col>
            <Col span={2}>
              {/* <Button loading={isAddTablePending} type="primary" onClick={onPostClick}>Post Table {tableId}</Button> */}
            </Col>
          </Row>
        )}
        pagination={false}
        columns={generateColumns()}
        dataSource={generateRows()}
      />
    </>
  );
};

const mapStateToProps = state => ({
  serviceOffering: getServiceOffering(state),
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(TableComponent);
