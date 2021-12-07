import React from "react";
import indexRoutes from "./routes/";
import { Router, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "./redux/Store";
import { History } from "./jwt/_helpers";
import { PrivateRoute } from "./routes/PrivateRoutes";
const App = () => {
  //const [currentUser, SetcurrentUser] = useState(null);
  return (
    <Provider store={configureStore()}>
      <Router history={History}>
        <Switch>
          {indexRoutes.map((prop, key) => {
            return (
              <PrivateRoute
                path={prop.path}
                key={key}
                component={prop.component}
              />
            );
          })}
        </Switch>
      </Router>
    </Provider>
  );
};
export default App;
