import { createSelector } from 'reselect';
import { REDUX_KEY } from '../../../utils/constants';

const reducerKey = REDUX_KEY.ESTIMATION;

export const getEstCost = createSelector(
  state => state[reducerKey].cost,
  cost => cost
);

export const getEstCompletion = createSelector(
  state => state[reducerKey].completion,
  completion => completion
);