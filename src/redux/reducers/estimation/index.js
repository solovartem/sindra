import { createReducer } from 'reduxsauce';
import { random } from 'lodash';
import { Types } from '../../actions/estimation';

// the initial state of this reducer
export const INITIAL_STATE = {
  cost: "$195.00",
  completion: '5 business days',
}

export const updateEstimation = (state = INITIAL_STATE, { cost, completion }) => ({
  ...state,
  cost,
  completion,
});

export const HANDLERS = {
  [Types.UPDATE_ESTIMATION]: updateEstimation,
}

export default createReducer(INITIAL_STATE, HANDLERS);
