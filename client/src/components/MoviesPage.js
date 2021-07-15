import React from 'react';
import { Link } from 'react-router-dom'
import { Container, Row, Button } from 'react-bootstrap';

import Header from './Header';
import CustomTable from './CustomTable';

class MoviesPage extends React.Component {

    render() {
        return (
            <Container>
                <Row className="mt-10 mb-3">
                    <Header />
                </Row>
                <Row className="py-3">
                    <Row className="justify-content-center my-3">
                        <Button variant="primary" className="col-6 col-md-2 border text-center">
                            <Link to="/movies/new" className="link-custom">
                                Add movie
                            </Link>
                        </Button>
                    </Row>
                    <CustomTable />
                </Row>
            </Container>
        );
    }

}

export default MoviesPage;