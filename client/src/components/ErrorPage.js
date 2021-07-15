import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Button } from 'react-bootstrap';

import Header from './Header';

class ErrorPage extends React.Component {

    componentDidMount() {
        setTimeout(() => {
            this.props.history.push('/');
        }, 5000);
    };

    render() {
        return (
            <Container>
                <Header />
                <Row>
                    <p className="h3 mx-auto my-5 text-center">
                        Oops! There was an error! You will be redirected to the home page shortly.
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
        )
    }
};

export default ErrorPage;