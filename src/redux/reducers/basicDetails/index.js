import { createReducer } from "reduxsauce";
import { Types } from "../../actions/basicDetails";

// the initial state of this reducer
export const INITIAL_STATE = {
  soaRequest: {
    appointmentDate: null,
    serviceOffering: "basic",
    updateFactFindWizard: false,
    serviceRequestWriting: false,
    complianceChecklist: false,
  },
  serviceOffering: "basic",
  client: {
    //
    firstName: "",
    lastName: "",
    // xplanId: "",
  },
  partner: {
    //
    firstName: "",
    lastName: "",
    // xplanId: "",
  },
};

export const updateBasicDetails = (
  state = INITIAL_STATE,
  { soaRequest, client, partner }
) => ({
  ...state,
  soaRequest,
  client,
  partner,
});

export const HANDLERS = {
  [Types.UPDATE_BASIC_DETAILS]: updateBasicDetails,
};

export default createReducer(INITIAL_STATE, HANDLERS);
