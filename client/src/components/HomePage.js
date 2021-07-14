import React from 'react';
import { Link } from 'react-router-dom';

import Footer from './Footer';

const HomePage = () => {
    return (
        <div>
            <h1>
                Movies
            </h1>
            <Link
                to={'/movies'}
                className="link">
                <h5>See all movies</h5>
            </Link>
            <Footer />
        </div>
    )
}

export default HomePage;