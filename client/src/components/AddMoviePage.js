import React from 'react';
import { Link } from 'react-router-dom';

import MovieForm from './MovieForm';

const axios = require('axios');

class AddMoviePage extends React.Component {

    componentDidMount() {
        console.log(this.props)
    }

    state = {
        title: "",
        genre: "",
        rating: 0,
        explicit: false,
        error: ""
    };

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

    postMovie = async (movie) => {
        try {
            const res = await axios.post('http://localhost:3001/api/v1/movies', movie);
            return res.status == 201
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

            if (this.postMovie(movie)) {
                this.props.history.push('/movies');
            } else {
                this.props.history.push('/error')
            }
        }
    }

    render() {
        return (
            <div>
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
                <Link to={"/movies"}>Go back</Link>
            </div>
        );
    }

}

export default AddMoviePage;