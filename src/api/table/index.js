import axiosTables from '../../axios/table';

export const getTableById = ({ tableId }) => (
  axiosTables.get('', {
    params: {
      tableId
    }
  })
  .then(({ data }) => data)
)

export const addTable = ({
  json
}) => axiosTables.post('', {
  json
}).then(({ data }) => data)

export default {
  getTableById,
  addTable
};
