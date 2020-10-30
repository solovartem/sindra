import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { debounce, uniqueId, get, isEmpty, isEqual } from "lodash";
import { Creators } from "../../redux/actions/recommendedStrategies";
// import { Creators } from '../../redux/actions/insuranceProduct'
import Card from "./components/Card";
import {
  getClient,
  getPartner,
  getServiceOffering,
} from "../../redux/selectors/basicDetails";
import { getPriceData, syncTabData } from "../../axios/login";
import TitleAndSubTitle from "../../components/TitleAndSubTitle";
import { getStrategies } from "../../axios/recommendedStratgies";
import { BackTop } from "antd";
import { Creators as EstimationCreators } from "../../redux/actions/estimation";
import { splitTextByFields } from "../../utils/common";

// Initial DATA for the component
const initialComponentData = [
  {
    title: "Superannuation",
    key: "superannuation",
    json: {},
  },
  {
    title: "Retirement Income",
    key: "retirementIncome",
    json: {},
  },
  {
    title: "Non-super Investments",
    key: "nonSuperInvestments",
    json: {},
  },
  {
    title: "Debt",
    key: "debt",
    json: {},
  },
  {
    title: "Cash Flow Management",
    key: "cashFlowManagement",
    json: {},
  },
  {
    title: "SMSF",
    key: "smsf",
    json: {},
  },
  {
    title: "Social Security",
    key: "socialSecurity",
    json: {},
  },
  {
    title: "Insurance",
    key: "insurance",
    json: {},
  },
  {
    title: "Estate planning",
    key: "estatePlanning",
    json: {},
  },
  {
    title: "Aged care",
    key: "agedCare",
    json: {},
  },
  {
    title: "Family Trust",
    key: "familyTrust",
    json: {},
  },
];

/*
  We have a state and a ref to store essentially the same data.
  The only diffrence is that the state is updated when ever a new row is added/deleted
  to cause a rerender and display that. While the ref is updated to keep trck of all the input field etc.
  This was done because it was difficult to store and manage the whole state tree in one place due to the dynamic
  nature of the component. This implimentation isn't prfect and it may not make sense. But it is a stable solution
  with some limitations(like we can't animate the seperate rows in and out).

  Two Functions (Both passed down to <Card/>):
  1. updateStoredTableData: Called to updated and change within a row (Updates only ref)
  2. updateTableData: Called on dropdown slect or Row delete (updates both state and ref)
*/

const RecommendedStrategies = ({
  client,
  partner,
  serviceOffering,
  dispatch,
  setTabsHasErrors,
  tabsHasErrors,
  setInvestmentPlatformsFromStrategies,
  validateStrategies,
}) => {
  const dispatchDebounce = useRef(debounce(execFunc => execFunc(), 2000))
    .current;
  // Ref to store the whole structure
  const storedTableDatas = useRef({});
  // Only to cause a rerender
  const [storedTableDataState, setStoredTableDataState] = useState({});
  const [componentData, setComponentData] = useState(initialComponentData);

  useEffect(() => {
    validateStrategies.current = () => {
      return validateInfo();
    };
  });

  const validateInfo = async (withChangeState = true) => {
    const res = Object.entries(storedTableDatas.current)
      .map(e => {
        const strategy = e[1];
        return strategy.data
          .map(d => {
            const splitedArr = splitTextByFields(d.dropdownValue);
            const finalArr = splitedArr.filter(item => item.includes("{{"));
            console.log(
              "VALIDATION VALUES",
              finalArr,
              d?.value,
              Object.values(d?.value || {}).filter(e => e),
              finalArr?.length ===
                Object.values(d?.value || {}).filter(e => e)?.length
            );
            return (
              finalArr?.length ===
              Object.values(d?.value || {}).filter(e => e)?.length
            );
          })
          .every(e => e);
      })
      .every(e => e);
    if (!res) {
      if (!tabsHasErrors.includes("Recommended Strategies")) {
        if (withChangeState) {
          setTabsHasErrors([...tabsHasErrors, "Recommended Strategies"]);
        }
      }
      return true;
    } else {
      const index = tabsHasErrors.findIndex(
        item => item === "Recommended Strategies"
      );
      if (index !== -1) {
        if (withChangeState) {
          setTabsHasErrors([
            ...tabsHasErrors.slice(0, index),
            ...tabsHasErrors.slice(index + 1),
          ]);
        }
      }
      return false;
    }
  };

  useEffect(() => {
    getStrategies(serviceOffering)
      .then(response => {
        dispatch(
          Creators.getStrategySuccess({
            strategies: response.data.strategies,
            references: response.data.references,
            isPending: false,
            error: false,
          })
        );
        const newArr = componentData.map(c => {
          return {
            title: c.title,
            key: c.key,
            json: response.data.strategies[c.key],
            references: response.data.references || {},
          };
        });
        setComponentData(newArr);
      })
      .catch(err => {
        console.log("error");
      });
  }, []);

  const updateStoredTableData = payload => {
    storedTableDatas.current = payload;
  };

  const updateTableData = payload => {
    setStoredTableDataState(payload);
    updateStoredTableData(payload);
  };

  const callAPI = async () => {
    let hasError = await validateInfo(false);
    console.log("ERROR", hasError);

    dispatchDebounce(async () => {
      if (!hasError) {
        let res = {
          strategies: [],
        };
        Object.entries(storedTableDatas.current).forEach(e => {
          const strategy = e[1];
          strategy.data.forEach(d => {
            res.strategies.push({
              key: d.dropdownKey,
              owner: d.owner,
              reasonForRecommendation: d?.reasonForRecommendation?.value || "",
              parameters: { ...d.value },
              alternateStrategies: d.children.map(child => child.value),
            });
          });
        });
        await syncTabData({ tab: "strategy", tableData: { ...res } });
        await getPriceData()
          .then(res => res.data)
          .then(data => {
            dispatch(EstimationCreators.updateEstimation(data));
          });

        if (tabsHasErrors.includes("Recommended Strategies")) {
          await validateInfo();
        }
      }
    });
  };

  console.log(componentData);

  return (
    <div className={"strategies"}>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "24px",
          paddingTop: "40px",
        }}
      >
        <TitleAndSubTitle
          title={"Strategy recommendations"}
          subTitle={
            "Use the dropdowns to specify recommendations for your client"
          }
          withIcon={false}
        />
      </div>

      {componentData.map(({ title, key, json, references }) => (
        <React.Fragment key={uniqueId()}>
          <Card
            setInvestmentPlatformsFromStrategies={
              setInvestmentPlatformsFromStrategies
            }
            key={uniqueId()}
            title={title}
            json={json || {}}
            client={client}
            partner={partner}
            storedTableDatas={storedTableDatas}
            componentKey={key}
            references={references}
            updateTableData={updateTableData}
            updateStoredTableData={updateStoredTableData}
            callAPI={callAPI}
            setTabsHasErrors={setTabsHasErrors}
            tabsHasErrors={tabsHasErrors}
            validateInfo={validateInfo}
          />
        </React.Fragment>
      ))}
      <BackTop />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    client: getClient(state),
    partner: getPartner(state),
    serviceOffering: getServiceOffering(state),
  };
};

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecommendedStrategies);
