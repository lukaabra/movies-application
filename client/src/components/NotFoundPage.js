import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Button } from 'react-bootstrap';

const NotFoundPage = () => (
    <Container>
        <Row>
            <p className="h3 mx-auto my-5 text-center">
                The page you are trying to access does not exist.
            </p>
        </Row>
        <Row className="justify-content-center my-3">
            <Button variant="dark" className="col-6 col-md-2 border text-center">
                <Link to="/" className="link-custom">
                    Back
                </Link>
            </Button>
        </Row>
    </Container>
);

export default NotFoundPage;