import { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router";
import { Router } from "react-router-dom";

// Routes
import { POSTS, POST_DETAILS } from "../constants/routes";

import history from "../core/history"

// Custom components
import Layout from "../Layout";
import Loading from "../Loading";

const ViewPosts = lazy(() => import("../Post"));
const ViewPost = lazy(() => import("../PostDetails"));

const Main = () => {
  return (
    <Router history={history}>
      <Switch>
        <Suspense fallback={<Loading />}>
          <Layout>
            <Route exact path="/" render={() => <Redirect to={POSTS} />} />
            <Route exact path={POSTS} component={ViewPosts} />
            <Route exact path={POST_DETAILS} component={ViewPost} />
          </Layout>
        </Suspense>
      </Switch>
    </Router>
  );
};

export default Main;