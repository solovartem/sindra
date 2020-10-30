import { createSelector } from 'reselect';
import { REDUX_KEY } from '../../../utils/constants';

const reducerKey = REDUX_KEY.TABLE_INVESTMENT.TABLE;

export const getTables = createSelector(
  state => state[reducerKey].tables,
  tables => tables
);

export const getIsPending = createSelector(
  state => state[reducerKey].isPending,
  isPending => isPending
);

export const getIsAddTablePending = createSelector(
  state => state[reducerKey].isAddTablePending,
  isAddTablePending => isAddTablePending
);

export const getClient = createSelector(
  state => state[reducerKey].client,
  client => client
);

export const getPartner = createSelector(
  state => state[reducerKey].partner,
  partner => partner
);

export const getFiles = createSelector(
  state => state[reducerKey].file,
  file => file
);