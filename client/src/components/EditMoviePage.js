import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Button } from 'react-bootstrap';

import Header from './Header';
import MovieForm from './MovieForm';

const axios = require('axios');

class EditMoviePage extends React.Component {

    async componentDidMount() {
        await this.getMovie();
    }

    state = {
        title: "",
        genre: "",
        rating: 0,
        explicit: false,
        error: "",
        movieId: ""
    };

    getMovie = async () => {
        const movieId = this.props.history.location.pathname.substr(this.props.history.location.pathname.lastIndexOf('/') + 1);
        this.setState(() => ({ movieId }));

        try {
            const res = await axios.get(`http://localhost:3001/api/v1/movies/${movieId}`);
            var movie = res.data[0];
        } catch (error) {
            this.props.history.push("/error");
        }

        this.setState(() => ({
            title: movie.name,
            genre: movie.genre,
            rating: movie.rating,
            explicit: movie.explicit
        }));
    }

    onTitleChange = (e) => {
        const title = e.target.value;
        this.setState(() => ({ title }));
    }

    onGenreChange = (e) => {
        const genre = e.target.value;
        this.setState(() => ({ genre }));
    }

    onRatingChange = (e) => {
        const rating = e.target.value;
        this.setState(() => ({ rating }));
    }

    onExplicitChange = (e) => {
        const explicit = e.target.value;
        this.setState(() => ({ explicit }));
    }

    updateMovie = async (movie) => {
        try {
            const res = await axios.put(`http://localhost:3001/api/v1/movies/${this.state.movieId}`, movie);
            return res.status === 200;
        } catch (error) {
            this.props.history.push("/error");
        }
    }

    onSubmit = (e) => {
        e.preventDefault();

        if (!this.state.title || !this.state.genre) {
            const error = "Please provide the title and genre";
            this.setState(() => ({ error }))
        } else if (this.state.rating < 0 || this.state.rating > 10) {
            const error = "Rating needs to be between 0 and 10";
            this.setState(() => ({ error }))
        } else {
            this.setState(() => ({ error: "" }));
            const movie = {
                name: this.state.title,
                genre: this.state.genre,
                rating: parseInt(this.state.rating),
                explicit: this.state.explicit
            };

            if (this.updateMovie(movie)) {
                this.props.history.push('/');
            } else {
                this.props.history.push('/error')
            }
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    {this.state.error && <h4>{this.state.error}</h4>}
                    <MovieForm
                        onTitleChange={this.onTitleChange}
                        onGenreChange={this.onGenreChange}
                        onRatingChange={this.onRatingChange}
                        onExplicitChange={this.onExplicitChange}
                        onSubmit={this.onSubmit}
                        title={this.state.title}
                        genre={this.state.genre}
                        rating={this.state.rating}
                        explicit={this.state.explicit}
                    />
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

}

export default EditMoviePage;