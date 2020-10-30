import { call, put, takeLatest, all, fork, take, cancel } from 'redux-saga/effects';
// import { toast } from 'react-toastify';
import { random } from 'lodash';
// import { getTables as getTablesSelector } from '../../selectors/insuranceProduct';
import { Types, Creators } from '../../actions/insuranceTable';
// import { Creators as EstimationCreators } from '../../actions/estimation';
// import { getTableById as getTableByIdApi, addTable as addTableApi } from '../../../api/table';
import { postDocument as uploadDocumentApi } from '../../../axios/insuranceProduct';

const delay = time => new Promise(resolve => setTimeout(resolve, time));

function* getTableById({ tableId }) {
   try {
    //  const oldTables = yield select(getTablesSelector);
    //  const apiTable =  yield call(getTableByIdApi, { tableId });
    const apiTable = {
      "tableID": []
    };
      yield call(delay, 2000);
      yield put(Creators.getTableSuccess({ table: apiTable }));

   } catch (error) {
      yield put(Creators.getTableFailure({ error }));
   }
}

function* addTable({ json }) {
  try {
    // const returnedJson = yield call(addTableApi, {
    //   json,
    // });
    // yield call(delay, 2000);
    // toast.success("Success!");
    // const cost = random(50, 600);
    // const completion = random(1, 6);

    // yield put(EstimationCreators.updateEstimation({ cost, completion }));
    yield put(Creators.addTableSuccess({ json: {} }));

  } catch (error) {
     yield put(Creators.addTableFailure({ error }));
  }
}

function* updateTable({ tableId, json }) {
  try {
    // const returnedJson = yield call(addTableApi, {
    //   tableId,
    //   json,
    // });
    // yield call(delay, 2000);
    // toast.success("Success!");
    // const cost = random(50, 600);
    // const completion = random(1, 6);

    // yield put(EstimationCreators.updateEstimation({ cost, completion }));
    yield put(Creators.updateTableSuccess({ json: {} }));

  } catch (error) {
     yield put(Creators.updateTableFailure({ error }));
  }
}

function* uploadDocumentRequest() {
  try {
    yield call(delay, 2000);
    const apiTable =  yield call(uploadDocumentApi);

    yield put(Creators.uploadFileSuccess({
      uploadFile: apiTable,
    }));

  } catch (error) {
    yield put(Creators.uploadFileError({ error }));
  }
}

function* watchUploadDocument() {
  yield takeLatest(Types.UPLOAD_FILE_REQUEST, uploadDocumentRequest);
}

function* watchGetTable() {
  yield takeLatest(Types.GET_TABLE_REQUEST, getTableById);
}

function* watchAddTable() {
  yield takeLatest(Types.ADD_TABLE_REQUEST, addTable);
}

function* watchUpdateTable() {
  yield takeLatest(Types.UPDATE_TABLE_REQUEST, updateTable);
}

export default function* tablesRoot() {
  while (yield take(Types.INIT_CONTAINER)) {
    const backgroundTasks = yield all([
      fork(watchGetTable),
      fork(watchAddTable),
      fork(watchUpdateTable),
      fork(watchUploadDocument),
    ]);

    yield take(Types.DESTROY_CONTAINER);
    yield cancel(backgroundTasks);
  }
}