import { createActions } from 'reduxsauce';

import { REDUX_KEY } from '../../../utils/constants';

export const { Types, Creators } = createActions({
  getTableRequest: {
    tableId: undefined
  },
  getTableSuccess: {
    table: {}
  },
  getTableFailure: {
    error: undefined
  },
  addTableRequest: {
    json: undefined,
  },
  addTableSuccess: {
    json: undefined,
  },
  addTableFailure: {
    error: undefined
  },
  updateTableRequest: {
    tableId: undefined,
    json: undefined,
  },
  updateTableSuccess: {
    json: undefined,
  },
  updateTableFailure: {
    error: undefined
  },
  updateRedux: {
    client: undefined,
    partner: undefined
  },
  uploadFileRequest: {
    isPending: false
  },
  uploadFileSuccess: {
    file: ''
  },
  uploadFileFailure: {
    error: undefined
  },
  initContainer: null,
  destroyContainer: null,
}, { prefix: `${REDUX_KEY.TABLE_INVESTMENT.TABLE}_` })