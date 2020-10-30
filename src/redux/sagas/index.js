import { all, fork } from 'redux-saga/effects';
import auth from './auth';
import investmentTable from './investmentTable';
import insuranceTable from './insuranceTable';
import recommendedStrategies from './recommendedStrategies';

export default function* root() {
  yield all([
    fork(auth),
    fork(investmentTable),
    fork(insuranceTable),
    fork(recommendedStrategies),
  ]);
}
