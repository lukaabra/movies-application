import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from '../components/HomePage';
import MoviesPage from '../components/MoviesPage';
import ErrorPage from '../components/ErrorPage';
import NotFoundPage from '../components/NotFoundPage';


const AppRouter = () => {

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={HomePage} exact={true} />
                <Route path="/movies" component={MoviesPage} exact={true} />
                <Route path="/error" component={ErrorPage} />
                <Route component={NotFoundPage} />
            </Switch>
        </BrowserRouter>
    );
}

export default AppRouter;