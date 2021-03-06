import { useContext } from "react";
import { Redirect, Route } from "react-router";
import { AuthContext } from "../context/authContext";

const PrivateRoute = ({ children, ...rest }) => {
    let auth = useContext(AuthContext);
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth.isLoggedIn ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

  export default PrivateRoute;