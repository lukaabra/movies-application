import React from 'react';

import Header from './Header';
import Table from './Table';
import Footer from './Footer';

class MoviesPage extends React.Component {

    render() {
        return (
            <div>
                <Header />
                <Table />
                <Footer />
            </div>
        );
    }

}

export default MoviesPage;