import React from 'react';
import { Container } from 'react-bootstrap';

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
                <div>
                    <p className="header__subtitle">Oops! There was an error! You will be redirected to the home page shortly.</p>
                    <button className="button">Home</button>
                </div>
            </Container>
        )
    }
};

export default ErrorPage;