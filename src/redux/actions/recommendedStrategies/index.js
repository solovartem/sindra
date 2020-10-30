import { createActions } from 'reduxsauce';

import { REDUX_KEY } from '../../../utils/constants';

export const { Types, Creators } = createActions({
	getStrategyRequest: {
		isPending: false
	},
	getStrategySuccess: {
		strategies: {}
	},
	getStrategyError: {
		error: undefined
	},
}, { prefix: `${REDUX_KEY.RECOMMENDED_STRATEGIES}_` })
