import { createActions } from 'reduxsauce';

import { REDUX_KEY } from '../../../utils/constants';

export const { Types, Creators } = createActions({
  updateEstimation: {
    cost: undefined,
    completion: undefined,
  },
}, { prefix: `${REDUX_KEY.ESTIMATION}_` })