import { combineReducers } from "redux";
import auth from "./auth";
import investmentTable from "./investmentTable";
import insuranceTable from "./insuranceTable";
import estimation from "./estimation";
import basicDetails from "./basicDetails";
import recommendedStrategies from "./recommendedStrategies";

import { REDUX_KEY } from '../../utils/constants';

export default combineReducers({
  AUTH: auth,
  [`${REDUX_KEY.TABLE_INVESTMENT.TABLE}`]: investmentTable,
  [`${REDUX_KEY.TABLE_INSURANCE.TABLE}`]: insuranceTable,
  [`${REDUX_KEY.ESTIMATION}`]: estimation,
  [`${REDUX_KEY.BASIC_DETAILS}`]: basicDetails,
  [`${REDUX_KEY.RECOMMENDED_STRATEGIES}`]: recommendedStrategies,
});
