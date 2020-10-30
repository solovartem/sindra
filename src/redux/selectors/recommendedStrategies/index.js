import { createSelector } from 'reselect';
import { REDUX_KEY } from '../../../utils/constants';

const reducerKey = REDUX_KEY.RECOMMENDED_STRATEGIES;

export const getStrategies= createSelector(
  state => state[reducerKey].strategies,
  strategies => strategies
);
