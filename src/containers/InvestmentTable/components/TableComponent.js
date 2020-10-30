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
  Popconfirm,
  Progress,
  notification,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  isEmpty,
  debounce,
  isEqual,
  cloneDeep,
  sortBy,
  differenceWith,
} from "lodash";
import { UploadOutlined } from "@ant-design/icons";
import { getPriceData, syncTabData } from "../../../axios/login";
import { Creators as EstimationCreators } from "../../../redux/actions/estimation";
import TitleAndSubTitle from "../../../components/TitleAndSubTitle";
import { connect } from "react-redux";
import { getServiceOffering } from "../../../redux/selectors/basicDetails";
import { getInvestmentProducts } from "../../../axios/investmentTable";
import { postDocument } from "../../../axios/investmentTable";
import CustomSelectInput from "./CustomSelectInput";
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
  validateInvestment,
  setTabsHasErrors,
  dispatch,
  investmentPlatformsFromStrategies: preSetPlatforms,
}) => {
  const [numRows, setNumRows] = useState(2);
  const [numColumns, setNumColumns] = useState(
    preSetPlatforms.length < 3 ? 3 : preSetPlatforms.length
  );
  const prevNumColumns = usePrevious(numColumns);

  const [fileList, setFileList] = useState({
    "Platform 1": [],
    "Platform 2": [],
    "Platform 3": [],
  });
  // structure states
  let formattedSelectedDropdownValue = {};
  let formattedPortfolioValues = {};
  let formattedTableValues = [];

  const columns = Array(numColumns)
    .fill("")
    .map((item, index) => `Platform ${index + 1}`);

  columns.forEach(item => {
    formattedPortfolioValues[item] = "";
    let selectedDropdownValueItem = {};
    let newTableValuesItem = {
      preSetId: undefined,
      targetProduct: "",
      platform: item,
      owner: "",
      valueOfNewPortfolio: "",
      // riskProfile: "",
      recomendationType: "",
      alternatives: "",
      portfolioType: {
        selected: "",
        otherName: null,
        customFiles: null,
      },
      additionalComment: "",
    };

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      selectedDropdownValueItem[`platform${rowIndex + 1}ToConsider`] = "";
      newTableValuesItem[`platform${rowIndex + 1}ToConsider`] = {
        platformId: undefined,
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
  const [platformsWithErrors, setPlatformsWithErrors] = useState([]);
  const [newPortfolioValue, setNewPortfolioValue] = useState(
    formattedPortfolioValues
  );
  // const [newDropdownValue, setNewDropdownValue] = useState();

  const [inputType2Options, setInputType2Options] = useState();
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(
    formattedSelectedDropdownValue
  );

  const dropdownRef = useRef();
  const dispatchDebounce = useRef(debounce(execFunc => execFunc(), 2000))
    .current;
  const firstUpdate = useRef(true);
  useEffect(() => {
    validateInvestment.current = () => {
      return validateInfo();
    };
  });

  const preSetPlatformsRef = useRef([]);

  const showNotification = text => {
    notification.info({
      message: "New platform created",
      description: (
        <>
          {`The platform `}
          <b>{text}</b>
          {` was automatically added to your Investment product requirements.`}
        </>
      ),
    });
  };

  const getPlatformToSet = () => {
    let totalLength = preSetPlatforms.length;
    let oldLength = preSetPlatformsRef.current.length;
    if (totalLength > oldLength) {
      return preSetPlatforms[oldLength];
    }
    return undefined;
  };

  const doesPlatformExist = toSet => {
    const exists = tableValues.find(
      platform =>
        platform.targetProduct === toSet.targetProduct &&
        platform.owner === toSet.owner
    );
    console.log("doesPlatformExist", exists, toSet, tableValues);
    return exists !== undefined;
  };

  const getEmptyColumnIndex = () => {
    let emptyIndices = [];
    tableValues.forEach((data, i) => {
      if (
        !data.targetProduct &&
        !data.owner &&
        !data.recomendationType &&
        !data.alternatives &&
        !data.portfolioType?.selected &&
        !data.additionalComment
      ) {
        emptyIndices.push(i);
      }
    });

    if (emptyIndices.length > 0) return emptyIndices[0];

    return undefined;
  };

  const setPlatform = (index, toSet) => {
    setTableValue(
      `Platform ${index + 1}`,
      "targetProduct",
      toSet.targetProduct
    );
    setTableValue(`Platform ${index + 1}`, "owner", toSet.owner);
    setTableValue(`Platform ${index + 1}`, "preSetId", toSet.id);
    preSetPlatformsRef.current = preSetPlatforms;
  };

  const addPlatformWithDefaults = (targetProduct, owner, text) => {
    let tableItem = {
      preSetId: undefined,
      targetProduct,
      owner,
      platform: `Platform ${numColumns + 1}`,
      portfolioType: "",
      // riskProfile: "",
      recomendationType: "",
      alternatives: "",
      valueOfNewPortfolio: "",
      additionalComment: "",
    };
    let selectedDropdownValueItem = {};
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      tableItem[`platform${rowIndex + 1}ToConsider`] = {
        platformId: undefined,
        customValue: undefined,
      };
      selectedDropdownValueItem[`platform${rowIndex + 1}ToConsider`] = "";
    }

    setNewPortfolioValue(prev => {
      prev[`Platform ${numColumns + 1}`] = "";
      return prev;
    });

    setTableValues(prev => {
      return [...prev, { ...tableItem }];
    });
    setTableValuesRef(prev => {
      return [...prev, { ...tableItem }];
    });
    setSelectedDropdownValue(prev => {
      prev[`Platform ${numColumns + 1}`] = selectedDropdownValueItem;
      return prev;
    });

    setNumColumns(prev => prev + 1);
    setFileList(prev => {
      let policy = `Platform ${numColumns + 1}`;
      return { ...prev, [policy]: [] };
    });
    preSetPlatformsRef.current = preSetPlatforms;
  };

  const deletePlatform = index => {
    setTableValues(prev => {
      let after = [...prev.slice(index + 1)];
      after.forEach((item, i) => {
        item.platform = `Platform ${index + 1 + i}`;
      });
      console.log([...prev.slice(0, index), ...prev.slice(index + 1)], after);
      return [...prev.slice(0, index), ...after];
    });

    setTableValuesRef(prev => {
      let after = [...prev.slice(index + 1)];
      after.forEach((item, i) => {
        item.platform = `Platform ${index + 1 + i}`;
      });
      return [...prev.slice(0, index), ...after];
    });

    setNumColumns(prev => prev - 1);

    setPlatformsWithErrors(prev => {
      let errorIndex = prev.findIndex(p => p === `Platform ${index + 1}`);
      return [...prev.slice(0, errorIndex), ...prev.slice(errorIndex + 1)];
    });

    setFileList(prev => {
      let keys = [...Object.keys(prev).sort()];

      let deleted = false;

      keys.forEach((key, i) => {
        if (deleted) {
          Object.defineProperty(
            prev,
            `Platform ${i}`,
            Object.getOwnPropertyDescriptor(prev, key)
          );
          delete prev[key];
        }
        if (i === index && !deleted) {
          delete prev[`Platform ${index + 1}`];
          deleted = true;
        }
      });

      return prev;
    });
  };

  useEffect(() => {
    const toSet = getPlatformToSet();
    const emptyPlatformIndex = getEmptyColumnIndex();

    console.log(toSet, tableValues);

    if (toSet !== undefined) {
      const exists = doesPlatformExist(toSet);

      if (!exists) {
        if (emptyPlatformIndex !== undefined) {
          setPlatform(emptyPlatformIndex, toSet);
        } else {
          addPlatformWithDefaults(toSet.targetProduct, toSet.owner, toSet.text);
        }
        showNotification(toSet.text);
      } else {
        preSetPlatformsRef.current = preSetPlatforms;
      }
    } else {
      preSetPlatformsRef.current = preSetPlatforms;
    }
  }, [preSetPlatforms]);

  useEffect(() => {
    getInvestmentProducts(serviceOffering)
      .then(response => {
        // dispatch(Creators.getStrategySuccess({strategies: response.data, isPending: false, error: false}))
        const keys = Object.keys(response.data);
        const modProducts = [];
        keys.forEach(key => {
          modProducts.push({
            key: key,
            value: response.data[key],
          });
        });
        console.log(modProducts);
        setInputType2Options(modProducts);
      })
      .catch(err => {
        console.log("error");
      });
  }, [serviceOffering]);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    dispatchDebounce(() => handlePostTable(tableId, tableValues));

    let payload = sortBy(tableValues, "platform");
    console.log("PAYLOAD", payload);
    const response = payload.map(p => {
      return {
        targetProduct: p.targetProduct,
        owner: p.owner || "",
        // riskProfile: p.riskProfile,
        recomendationType: p.recomendationType,
        alternatives: p.alternatives,
        portfolioType: p.portfolioType,
        additionalComment: p.additionalComment,
        platformsToConsider: {
          ...Object.values(p)
            ?.map(g => g?.platformId)
            ?.filter(f => f),
        },
      };
    });
    console.log("Response", response);

    if (response.length > 0) {
      let shouldDispatch = false;
      for (let i = 0; i < tableValues.length; i++) {
        let data = tableValues[i];
        if (
          !isEqual(
            data,
            tableValuesRef.find(item => item.platform === data.platform)
          )
        ) {
          if (
            data?.portfolioType?.selected &&
            data.owner &&
            data.recomendationType &&
            data.targetProduct &&
            data.alternatives
          ) {
            shouldDispatch = true;
          } else {
            shouldDispatch = false;
            break;
          }
        }
      }

      let filteredResponse = response.filter(
        p =>
          p.targetProduct &&
          p.owner &&
          p.recomendationType &&
          p.alternatives &&
          p.portfolioType?.selected
      );
      console.log("Response", filteredResponse);

      dispatchDebounce(async () => {
        if (shouldDispatch) {
          await syncTabData({
            tab: "investment",
            tableData: { ...filteredResponse },
          });
          getPriceData()
            .then(res => res.data)
            .then(data => {
              dispatch(EstimationCreators.updateEstimation(data));
            });
        }
      });
      // if(!checkErrors(false)){
      //     syncTabData({tab:'investment',tableData:{...tableValues}})
      //   }
    }

    if (numColumns > prevNumColumns) {
      const ref = document.querySelector(".ant-table-content");
      ref.scrollLeft = ref.scrollWidth - ref.getBoundingClientRect().width;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableValues]);

  // const onPostClick = () => {
  //   handlePostTable(tableId, tableValues);
  // }

  const validateInfo = async () => {
    let platformWithErrors = [];
    tableValues.forEach((data, index) => {
      if (
        !isEqual(
          data,
          tableValuesRef.find(item => item.platform === data.platform)
        )
      ) {
        if (
          !data.portfolioType?.selected ||
          !data.owner ||
          !data.recomendationType ||
          !data.targetProduct ||
          !data.alternatives
        ) {
          platformWithErrors = [...platformWithErrors, data.platform];
        }
      }
    });
    setPlatformsWithErrors(platformWithErrors);
    if (!platformWithErrors.length) {
      setTabsHasErrors(prev => {
        let newPrev = [...prev];
        if (prev.includes("Investment Products"))
          newPrev.splice(prev.indexOf("Investment Products"), 1);
        return [...newPrev];
      });
    } else {
      setTabsHasErrors(prev =>
        prev.includes("Investment Products")
          ? prev
          : [...prev, "Investment Products"]
      );
    }
    return platformWithErrors.length; //TODO: will be edited
  };

  const getValueForComponent = (platform, field, component) => {
    const currentPlatform = tableValues.find(x => x.platform === platform);
    if (currentPlatform) {
      if (field === "targetProduct") {
        return currentPlatform[field].slice(
          currentPlatform[field].indexOf(":") + 1
        );
      }
      if (component === "PlatformToConsider") {
        return (
          currentPlatform[field]["platformId"] ||
          currentPlatform[field]["customValue"]
        );
      }
      return currentPlatform[field];
    }
    return undefined;
  };

  const onNewPortfolioValueChange = (platform, value) => {
    setTableValue(platform, "portfolioValue", value);
    setNewPortfolioValue({
      ...newPortfolioValue,
      [platform]: value,
    });
  };

  // const onNewDropdownValueChange = (event) => {
  //   setNewDropdownValue(event.target.value);
  // }

  // const addNewDropdownOption = (platform, fieldValue) => {
  //   if (!isEmpty(newDropdownValue)) {
  //     setInputType2Options([
  //       ...inputType2Options,
  //       {
  //         key: `_${newDropdownValue}`,
  //         value: newDropdownValue,
  //         type: 'custom',
  //       }
  //     ]);
  //     setSelectedDropdownValue({
  //       ...selectedDropdownValue,
  //       [platform]: {
  //         ...selectedDropdownValue[platform],
  //         [fieldValue]: newDropdownValue
  //       },
  //     });
  //     onPlatformConsiderChange(platform, newDropdownValue, fieldValue);
  //     dropdownRef.current.focus();
  //     setNewDropdownValue('');
  //   }
  // }

  const onPlatformConsiderChange = (platform, value, fieldValue) => {
    let newConsider = {};

    if (value.startsWith("_")) {
      newConsider = {
        customValue: value.substring(1, value.length),
        platformId: undefined,
      };
    } else {
      newConsider = {
        customValue: undefined,
        platformId: value,
      };
    }

    setTableValue(platform, fieldValue, newConsider);
  };

  const validateFields = platform => () => {
    if (platformsWithErrors.includes(platform)) validateInfo();
  };

  const setTableValue = (platform, key, value) => {
    const currentPlatformIndex = tableValues.findIndex(
      x => x.platform === platform
    );
    const currentPlatform = tableValues[currentPlatformIndex] || {};
    let newPlatform = Object.assign(currentPlatform, { [key]: value });

    if (key === "recomendationType") {
      newPlatform = Object.assign(currentPlatform, {
        alternatives: value === "new" ? "3" : "0",
      });
    }

    setTableValues([
      ...tableValues.slice(0, currentPlatformIndex),
      newPlatform,
      ...tableValues.slice(currentPlatformIndex + 1),
    ]);
  };

  useEffect(() => {
    console.log(tableValues);
  });

  const OwnerComponent = platform => {
    return (
      <Select
        showSearch
        value={getValueForComponent(platform, "owner")}
        onChange={value => setTableValue(platform, "owner", value)}
        onBlur={validateFields(platform, "owner")}
        style={
          platformsWithErrors.includes(platform) &&
          !getValueForComponent(platform, "owner")
            ? { border: "2px solid red", width: "100%" }
            : { width: "100%" }
        }
      >
        {
          <Option value="client">
            Client {doesClientExist(client) ? `(${client.firstName})` : ""}
          </Option>
        }
        {doesPartnerExist(partner) ? (
          <Option value="partner">Partner ({partner.firstName})</Option>
        ) : null}
        {doesPartnerExist(partner) ? (
          <Option value="joint">Joint</Option>
        ) : null}
      </Select>
    );
  };

  const targetProductComponent = platform => {
    return (
      <>
        <CustomSelectInput
          getValueForComponent={getValueForComponent}
          platform={platform}
          setTableValue={setTableValue}
          validateFields={validateFields}
          platformsWithErrors={platformsWithErrors}
          inputType2Options={inputType2Options}
          setInputType2Options={setInputType2Options}
        />
      </>
    );
  };

  const PlatformToConsiderComponent = (platform, fieldValue) => (
    <Select
      ref={dropdownRef}
      showSearch
      filterOption={(inputVal, option) =>
        option.label.toUpperCase().includes(inputVal.toUpperCase())
      }
      style={{ width: "100%" }}
      value={
        getValueForComponent(platform, fieldValue, "PlatformToConsider") ||
        selectedDropdownValue[platform][fieldValue]
      }
      onBlur={validateFields(platform, "PlatformToConsider")}
      dropdownRender={menu => (
        <div>
          {menu}
          {/* <Divider style={{ margin: '4px 0' }} />
          <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
            <Input style={{ flex: 'auto' }} value={newDropdownValue} onChange={onNewDropdownValueChange} />
            <a href="!#"
              style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
              onClick={(event) => {event.preventDefault();addNewDropdownOption(platform, fieldValue)}}
            >
              <PlusOutlined />
            </a>
          </div> */}
        </div>
      )}
      onChange={value => onPlatformConsiderChange(platform, value, fieldValue)}
    >
      {inputType2Options &&
        inputType2Options.map(item => (
          <Option key={item.key} value={item.key}>
            {item.value}
          </Option>
        ))}
      {/* {inputType2Options.sort((a,b)=>a.text.toUpperCase()>b.text.toUpperCase()?1:-1).map(item => (
        <Option key={item.value} label={item.text} >{item.text}</Option>
      ))} */}
    </Select>
  );

  const ValueOfNewPortfolioComponent = platform => {
    return (
      <InputNumber
        defaultValue={
          newPortfolioValue[platform] ||
          getValueForComponent(
            platform,
            "valueOfNewPortfolio",
            "ValueOfNewPortfolio"
          )
        }
        onChange={value => onNewPortfolioValueChange(platform, value)}
        onBlur={validateFields(platform, "PlatformToConsider")}
        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={value => value.replace(/\$\s?|(,*)/g, "")}
        style={{ width: "100%" }}
      />
    );
  };

  const onRemove = platform => file => {
    const index = fileList[platform].findIndex(f => f.uid === file.uid);
    if (index !== -1) {
      setFileList(prev => {
        let list = prev[platform];
        return {
          ...prev,
          [platform]: [...list.slice(0, index), ...list.slice(index + 1)],
        };
      });
    }
    let obj = getValueForComponent(platform, "portfolioType");
    const resultIndex = obj.customFiles.findIndex(f => f === file.fileId);
    if (resultIndex !== -1) {
      obj = {
        ...obj,
        customFiles: [
          ...(obj.customFiles || []).slice(0, index),
          ...(obj.customFiles || []).slice(index + 1),
        ],
      };
      setTableValue(platform, "portfolioType", obj);
    }
  };

  // const RiskProfileComponent = (platform) => (
  //   <Select
  //     showSearch
  //     onChange={(value) => setTableValue(platform, 'riskProfile', value)}
  //     value={getValueForComponent(platform, 'riskProfile')}
  //     onBlur={validateFields(platform, 'riskProfile')}
  //     style={platformsWithErrors.includes(platform) && !getValueForComponent(platform, 'riskProfile') ? {border: '2px solid red',width:'100%'} : {width:'100%'}}
  //     filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
  //   >
  //     <Option key="preservation" value="preservation">Preservation</Option>
  //     <Option key="defensice" value="defensice">Defensive</Option>
  //     <Option value="moderateg50">Moderate G50</Option>
  //     <Option value="moderateg60">Moderate G60</Option>
  //     <Option value="moderateg70">Moderate G70</Option>
  //   </Select>
  // );
  const PortfolioTypeComponent = platform => {
    const value = getValueForComponent(platform, "portfolioType")?.selected;

    const customRequest = platform => ({ file, onSuccess, onProgress }) => {
      const data = new FormData();
      data.append("file", file, file.fileName);
      let obj = getValueForComponent(platform, "portfolioType");
      const type = "portfolios";
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
            let list = prev[platform];
            return { ...prev, [platform]: [...list, file] };
          });
          obj = {
            ...obj,
            customFiles: [...(obj.customFiles || []), response.fileId],
          };
          setTableValue(platform, "portfolioType", obj);
          onSuccess(response);
          message.success(`${file.fileName} was uploaded succesfully`);
        })
        .catch(err => {
          console.log("investment error");
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
            setTableValue(platform, "portfolioType", obj);
          }}
          onBlur={validateFields(platform, "portfolioType")}
          value={getValueForComponent(platform, "portfolioType")?.selected}
          style={
            platformsWithErrors.includes(platform) &&
            !getValueForComponent(platform, "portfolioType")?.selected
              ? { border: "2px solid red", width: "100%" }
              : { width: "100%" }
          }
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          <OptGroup label="Custom portfolio">
            <Option value="uploadedOnXplan">Uploaded on Xplan</Option>
            <Option value="uploadedOnDigitalRequest">
              Uploaded on Digital Request
            </Option>
            <Option value="wealthsolver">Wealthsolver</Option>
          </OptGroup>
          <OptGroup label="Model portfolio">
            <Option value="lowCostModelPortfolio">
              Low cost model portfolio
            </Option>
            <Option value="accumulationModelPortfolio">
              Accumulation model portfolio
            </Option>
            <Option value="retirementModelPortfolio">
              Retirement model portfolio
            </Option>
            <Option value="other">Other - please include in Comments</Option>
            <Option value="n/a">N/A</Option>
          </OptGroup>
        </Select>
        {value === "uploadedOnDigitalRequest" ? (
          <div>
            <Upload
              fileList={fileList[platform]}
              customRequest={customRequest(platform)}
              onRemove={onRemove(platform)}
            >
              <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                Upload document
              </Button>
            </Upload>
          </div>
        ) : null}
        {value === "other" && (
          <div>
            <Input
              placeholder="Type model here"
              style={{ width: "100%", marginTop: "12px" }}
              onChange={e => {
                let obj = getValueForComponent(platform, "portfolioType");
                obj = { ...obj, otherName: e.target.value };
                setTableValue(platform, "portfolioType", obj);
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const RecommendationTypeComponent = platform => (
    <Select
      showSearch
      onChange={value => setTableValue(platform, "recomendationType", value)}
      value={getValueForComponent(platform, "recomendationType")}
      onBlur={validateFields(platform, "recomendationType")}
      style={
        platformsWithErrors.includes(platform) &&
        !getValueForComponent(platform, "recomendationType")
          ? { border: "2px solid red", width: "100%" }
          : { width: "100%" }
      }
      filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
    >
      <Option value="retain">Retain</Option>
      <Option value="rebalance">Rebalance</Option>
      <Option value="new">New</Option>
    </Select>
  );

  const AlternativesComponent = platform => (
    <Select
      showSearch
      onChange={value => setTableValue(platform, "alternatives", value)}
      value={getValueForComponent(platform, "alternatives")}
      onBlur={validateFields(platform, "alternatives")}
      style={
        platformsWithErrors.includes(platform) &&
        !getValueForComponent(platform, "alternatives")
          ? { border: "2px solid red", width: "100%" }
          : { width: "100%" }
      }
      filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
    >
      {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(val => (
        <Option key={val} value={val}>
          {val}
        </Option>
      ))}
    </Select>
  );

  const renderAdditionalCommentsComponent = platform => (
    <Input
      style={{ width: "100%" }}
      value={getValueForComponent(platform, "additionalComment")}
      onChange={event =>
        setTableValue(platform, "additionalComment", event.target.value)
      }
    />
  );

  // const RiskProfileCheckboxesComponent = (platform) => (
  //   <Checkbox.Group
  //     style={{ width: '100%' }}
  //     onChange={(value) => setTableValue(platform, 'riskProfileCheckboxes', value)}
  //     defaultValue={getValueForComponent(platform, 'riskProfileCheckboxes')}
  //   >
  //     <Row>
  //       <Col span={24}>
  //         <Checkbox value="accumulation">Accumulation Model</Checkbox>
  //       </Col>
  //       <Col span={24}>
  //         <Checkbox value="retirement">Retirement Model</Checkbox>
  //       </Col>
  //       <Col span={24}>
  //         <Checkbox value="lowCost">Low Cost Model</Checkbox>
  //       </Col>
  //       <Col span={24}>
  //         <Checkbox value="practiceSpecific">Practice Specific Model</Checkbox>
  //       </Col>
  //       <Col span={24}>
  //         <Checkbox value="custom">Custom Portfolio</Checkbox>
  //       </Col>
  //     </Row>
  //   </Checkbox.Group>
  // );
  const renderColumns = (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    if (row.key === "addNewRow") {
      obj.props.colSpan = 0;
    }
    if (row.key === "Portfolio type") {
      obj.props.style = { verticalAlign: "baseline" };
    }
    return obj;
  };

  const addPlatform = () => {
    let tableItem = {
      preSetId: undefined,
      targetProduct: "",
      owner: "",
      platform: `Platform ${numColumns + 1}`,
      portfolioType: "",
      // riskProfile: "",
      recomendationType: "",
      alternatives: "",
      valueOfNewPortfolio: "",
      additionalComment: "",
    };
    let selectedDropdownValueItem = {};
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      tableItem[`platform${rowIndex + 1}ToConsider`] = {
        platformId: undefined,
        customValue: undefined,
      };
      selectedDropdownValueItem[`platform${rowIndex + 1}ToConsider`] = "";
    }

    setNewPortfolioValue(prev => {
      prev[`Platform ${numColumns + 1}`] = "";
      return prev;
    });

    setTableValues(prev => {
      return [...prev, { ...tableItem }];
    });
    setTableValuesRef(prev => {
      return [...prev, { ...tableItem }];
    });
    setFileList(prev => {
      let policy = `Platform ${numColumns + 1}`;
      return { ...prev, [policy]: [] };
    });
    setSelectedDropdownValue(prev => {
      prev[`Platform ${numColumns + 1}`] = selectedDropdownValueItem;
      return prev;
    });

    setNumColumns(prev => prev + 1);
  };

  function renderColumnAddButton(customStyle) {
    return (
      <div style={customStyle ? { ...customStyle } : null}>
        <Button type="dashed" onClick={addPlatform} style={{ height: "100%" }}>
          <PlusOutlined /> Add Platform
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
              item[`platform${numRows + 1}ToConsider`] = {
                customValue: undefined,
                platformId: undefined,
              };
              return item;
            });
            return newData;
          });
          setTableValuesRef(prev => {
            let newData = [...prev];
            newData.map(item => {
              item[`platform${numRows + 1}ToConsider`] = {
                customValue: undefined,
                platformId: undefined,
              };
              return item;
            });
            return newData;
          });
          setSelectedDropdownValue(prev => {
            let newData = Object.assign({}, prev);
            Object.keys(prev).forEach(
              item => (newData[item][`platform${numRows + 1}ToConsider`] = "")
            );
            return newData;
          });

          setNumRows(prev => prev + 1);
        }}
        style={{ width: "100%" }}
      >
        <span>
          <PlusOutlined /> Add Platform to consider
        </span>
      </Button>
    );
  }

  const generateColumns = () => {
    let columns = [
      {
        width: 40,
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
          // nested logic to set secondary text for table rows
          return (
            <>
              <Text strong>{text}</Text>
              {text === "Portfolio type" ? (
                <>
                  <br />
                  <Text type="secondary">
                    If no portfolio type is applicable for this platform, please
                    select N/A
                  </Text>
                </>
              ) : text === "Alternatives" ? (
                <>
                  <br />
                  <Text type="secondary">
                    Number of platforms to be considered
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
          className: `investment-platform-column investment-platform${
            colsIndex + 1
          }`,
          title: () => {
            return (
              <div className="custom-header">
                <span>{`Platform ${colsIndex + 1}`}</span>
                <span className="platform-delete-btn">
                  <Popconfirm
                    title="Are you sure you want to delete this investment platform?"
                    onConfirm={() => {
                      deletePlatform(colsIndex);
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
          dataIndex: `platform${colsIndex + 1}`,
          key: `platform${colsIndex + 1}`,
          render: renderColumns,
          // filters: [],
          // onFilter: () => deletePlatform(colsIndex),
          // filterIcon: <DeleteOutlined />
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
        className: "investment-add-platform-column",
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
        item[`platform${colsIndex + 1}`] = func(`Platform ${colsIndex + 1}`);
      }
      return item;
    }
    let staticRows = [
      {
        key: "addNewRow",
        firstColumn: renderAddRowButton(),
      },
      {
        key: "Value of new portfolio",
        firstColumn: "Value of new portfolio",
        ...mapFuncToValues(ValueOfNewPortfolioComponent),
      },
      // {
      //   key: 'Risk Profile',
      //   firstColumn: 'Risk Profile',
      //   ...mapFuncToValues(RiskProfileComponent)
      // },
      {
        key: "Recommendation Type",
        firstColumn: "Recommendation Type",
        ...mapFuncToValues(RecommendationTypeComponent),
      },
      {
        key: "Alternatives",
        firstColumn: "Alternatives",
        ...mapFuncToValues(AlternativesComponent),
      },
      {
        key: "Portfolio type",
        firstColumn: "Portfolio type",
        ...mapFuncToValues(PortfolioTypeComponent),
      },
      {
        key: "Additional comments",
        firstColumn: "Additional comments",
        ...mapFuncToValues(renderAdditionalCommentsComponent),
      },
    ];

    let data = [
      {
        key: "targetProduct",
        firstColumn:
          serviceOffering === "basic"
            ? "Name of Platform"
            : "Name of new/rebalanced platform",
        ...mapFuncToValues(targetProductComponent),
        addColumn: renderColumnAddButton({ transform: "rotate(90deg)" }),
      },
      {
        key: "Owner",
        firstColumn: "Owner",
        ...mapFuncToValues(OwnerComponent),
      },
    ];

    if (serviceOffering !== "basic") {
      for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        let itemRow = {
          key: `Platform ${rowIndex + 1} to consider`,
          firstColumn: `Platform ${rowIndex + 1} to consider`,
        };
        for (let colIndex = 0; colIndex < numColumns; colIndex++) {
          itemRow[`platform${colIndex + 1}`] = PlatformToConsiderComponent(
            `Platform ${colIndex + 1}`,
            `platform${rowIndex + 1}ToConsider`
          );
        }

        data = [
          ...data,
          {
            key: `Platform ${rowIndex + 1} to consider`,
            firstColumn: `Platform ${rowIndex + 1} to consider`,
            ...itemRow,
          },
        ];
      }
    } else {
      staticRows = staticRows.slice(2);
    }
    return [...data, ...staticRows];
  };

  return (
    <>
      <TitleAndSubTitle
        title={"Investment recommendations"}
        subTitle={"Include all platforms to be listed as proposed investments"}
        withIcon={false}
      />
      <Table
        // size='small'
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
        scroll={{ x: "max-content" }}
        pagination={false}
        columns={generateColumns()}
        dataSource={generateRows()}
        id="investment-table"
      />
    </>
  );
};

const mapStateToProps = state => ({
  serviceOffering: getServiceOffering(state),
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(TableComponent);
