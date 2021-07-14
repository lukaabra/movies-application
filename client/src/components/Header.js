import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Link to={"/movies"}>
            <h1>
                Movies
            </h1>
        </Link>
    )
}

export default Header;