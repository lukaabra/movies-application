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
                <a>See all movies</a>
            </Link>
            <Footer />
        </div>
    )
}

export default HomePage;