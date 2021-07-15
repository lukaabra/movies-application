import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import MoviesPage from '../components/MoviesPage';
import AddMoviePage from '../components/AddMoviePage';
import ErrorPage from '../components/ErrorPage';
import NotFoundPage from '../components/NotFoundPage';
import EditMoviePage from '../components/EditMoviePage';


const AppRouter = () => {

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={MoviesPage} exact={true} />
                <Route path="/movies/new" component={AddMoviePage} />
                <Route path="/movies/:id" component={EditMoviePage} />
                <Route path="/error" component={ErrorPage} />
                <Route component={NotFoundPage} />
            </Switch>
        </BrowserRouter>
    );
}

export default AppRouter;