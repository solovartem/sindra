import { createReducer } from 'reduxsauce';
import { Types } from '../../actions/insuranceTable';

// the initial state of this reducer
export const INITIAL_STATE = {
  tables: {},
  isPending: false,
  isAddTablePending: false,
  error: false,
  file: ''
}

export const getTableRequest = (state = INITIAL_STATE) => ({
  ...state,
  isPending: true,
});

export const getTableSuccess = (state = INITIAL_STATE, { table = {} }) => ({
  ...state,
  tables:{
    ...table
  },
  isPending: false,
  error: false,
});

export const getTableFailure = (state = INITIAL_STATE, { error = {} }) => ({
  ...state,
  isPending: false,
  error: true,
});

export const addTableRequest = (state = INITIAL_STATE) => ({
  ...state,
  isAddTablePending: true,
});

export const addTableSuccess = (state = INITIAL_STATE, { json = {} }) => ({
  ...state,
  json,
  isAddTablePending: false,
  error: false,
});

export const addTableFailure = (state = INITIAL_STATE, { error = {} }) => ({
  ...state,
  isAddTablePending: false,
  error: true,
});

export const updateTableRequest = (state = INITIAL_STATE) => ({
  ...state,
  isAddTablePending: true,
});

export const updateTableSuccess = (state = INITIAL_STATE, { json = {} }) => ({
  ...state,
  json,
  isAddTablePending: false,
  error: false,
});

export const updateTableFailure = (state = INITIAL_STATE, { error = {} }) => ({
  ...state,
  isAddTablePending: false,
  error: true,
});

export const uploadFileRequest = (state = INITIAL_STATE, { isPending }) => {
  return {
    ...state,
    isPending: true,
  };
};

export const uploadFileSuccess = (state = INITIAL_STATE, {file = '', isPending, error}) => ({
  ...state,
  file ,
  isPending: false,
  error: false
});

export const uploadFileFailure = (state = INITIAL_STATE, {error = {}, isPending}) => ({
  ...state,
  isPending: false,
  error: true,
});


export const HANDLERS = {
  [Types.GET_TABLE_REQUEST]: getTableRequest,
  [Types.GET_TABLE_SUCCESS]: getTableSuccess,
  [Types.GET_TABLE_FAILURE]: getTableFailure,
  [Types.ADD_TABLE_REQUEST]: addTableRequest,
  [Types.ADD_TABLE_SUCCESS]: addTableSuccess,
  [Types.ADD_TABLE_FAILURE]: addTableFailure,
  [Types.UPDATE_TABLE_REQUEST]: updateTableRequest,
  [Types.UPDATE_TABLE_SUCCESS]: updateTableSuccess,
  [Types.UPDATE_TABLE_FAILURE]: updateTableFailure,
  [Types.UPLOAD_FILE_REQUEST]: uploadFileRequest,
  [Types.UPLOAD_FILE_SUCCESS]: uploadFileSuccess,
  [Types.UPLOAD_FILE_FAILURE]: uploadFileFailure
}

export default createReducer(INITIAL_STATE, HANDLERS);