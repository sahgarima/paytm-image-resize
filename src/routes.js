'use strict';

import React from 'react'
import { Route, IndexRoute } from 'react-router'
import ImageConvertor from './components/ImageConvertor'
import Page from './components/Page'
// import AthletePage from './components/AthletePage';
import NotFoundPage from './components/NotFoundPage';

const routes = (
  <Route path="/" component={ImageConvertor}>
    <IndexRoute component={ImageConvertor}/>
   
    <Route path="/page" component={Page}>
        </Route>
         <Route path="*" component={NotFoundPage}/>
  </Route>
);

export default routes;