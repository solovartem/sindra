import {createReducer} from 'reduxsauce';
import { Types } from '../../actions/recommendedStrategies';

// the initial state of this reducer
export const INITIAL_STATE = {
	strategies: {},
	isPending: false,
	error: false,
}

export const getStrategyRequest = (state = INITIAL_STATE, { isPending }) => {
	return {
		...state,
		isPending: true,
	};

};

export const getStrategySuccess = (state = INITIAL_STATE, {strategies = {}, references = {}, isPending, error}) => ({
		...state,
	strategies: {
		...strategies
	},
	references: {
			...references
	},
	isPending: false,
	error: false
});

export const getStrategyError = (state = INITIAL_STATE, {error = {}, isPending}) => ({
	...state,
	isPending: false,
	error: true,
});

export const HANDLERS = {
	[Types.GET_STRATEGY_REQUEST]: getStrategyRequest,
	[Types.GET_STRATEGY_SUCCESS]: getStrategySuccess,
	[Types.GET_STRATEGY_ERROR]: getStrategyError,
}

export default createReducer(INITIAL_STATE, HANDLERS);
