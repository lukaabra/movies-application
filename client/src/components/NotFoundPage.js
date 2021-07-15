import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const NotFoundPage = () => (
    <Container>
        <p className="header__subtitle">The page you are trying to access does not exist.</p>
        <Link to={'/'} className="button">Home</Link>
    </Container>
);

export default NotFoundPage;