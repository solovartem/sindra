export const createAction = (
  type,
  meta,
  error,
) => ({ type, meta, error });

export const createPayloadAction = (
  type,
  payload,
  meta,
  error,
)=> ({
  ...createAction(type, meta, error),
  payload,
});