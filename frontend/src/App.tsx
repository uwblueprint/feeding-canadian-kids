import "bootstrap/dist/css/bootstrap.min.css";
import React, { useMemo, useReducer, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "./Routes";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import sampleContextReducer from "./reducers/SampleContextReducer";
import { AuthenticatedUser } from "./types/AuthTypes";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    currentUser,
  );
  const currentAuthContext = useMemo(
    () => ({ authenticatedUser, setAuthenticatedUser }),
    [authenticatedUser],
  );

  // Some sort of global state. Context API replaces redux.
  // Split related states into different contexts as necessary.
  // Split dispatcher and state into separate contexts as necessary.
  const [sampleContext, dispatchSampleContextUpdate] = useReducer(
    sampleContextReducer,
    DEFAULT_SAMPLE_CONTEXT,
  );

  return (
    <SampleContext.Provider value={sampleContext}>
      <SampleContextDispatcherContext.Provider
        value={dispatchSampleContextUpdate}
      >
        <AuthContext.Provider value={currentAuthContext}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </AuthContext.Provider>
      </SampleContextDispatcherContext.Provider>
    </SampleContext.Provider>
  );
};

export default App;
