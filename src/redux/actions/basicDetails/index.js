import { createActions } from 'reduxsauce';

import { REDUX_KEY } from '../../../utils/constants';

export const { Types, Creators } = createActions({
  updateBasicDetails: {
    soaRequest:{
      appointmentDate: null,
      serviceOffering: ""
    },
    client: {
      salutation: undefined,
      firstName: undefined,
      lastName: undefined,
    },
    partner: {
      salutation: undefined,
      firstName: undefined,
      lastName: undefined,
    }
  },
}, { prefix: `${REDUX_KEY.BASIC_DETAILS}_` })