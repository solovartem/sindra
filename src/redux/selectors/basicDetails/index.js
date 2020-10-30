import { createSelector } from 'reselect';
import { REDUX_KEY } from '../../../utils/constants';

const reducerKey = REDUX_KEY.BASIC_DETAILS;

export const getClient = createSelector(
  state => state[reducerKey].client,
  client => client
);

export const getPartner = createSelector(
  state => state[reducerKey].partner,
  partner => partner
);

export const getServiceOffering= createSelector(
  state => state[reducerKey].soaRequest.serviceOffering,
  serviceOffering=>serviceOffering
)