import React, { useMemo, useReducer, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "./Routes";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { AuthenticatedUser } from "./types/UserTypes";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser>(currentUser);
  const currentAuthContext = useMemo(
    () => ({ authenticatedUser, setAuthenticatedUser }),
    [authenticatedUser],
  );

  // Providers for app-specific state like contexts are here.
  // For providers for libraries like Apollo and OAuth, see index.tsx.
  return (
    <AuthContext.Provider value={currentAuthContext}>
      <BrowserRouter>
        <Header />
        <Routes />
        <Footer />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
