import React from 'react';

import Header from './Header';
import Footer from './Footer';

class ErrorPage extends React.Component {

    componentDidMount() {
        setTimeout(() => {
            this.props.history.push('/');
        }, 5000);
    };

    render() {
        return (
            <div>
                <Header />
                <div>
                    <p className="header__subtitle">Oops! There was an error! You will be redirected to the home page shortly.</p>
                    <button className="button">Home</button>
                </div>
                <Footer />
            </div>
        )
    }
};

export default ErrorPage;