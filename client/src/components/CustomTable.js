import React from 'react';
import { Row, Table } from 'react-bootstrap';

import MovieTableRow from './MovieTableRow';
const axios = require('axios');

class CustomTable extends React.Component {

    state = {
        movies: []
    }

    async componentDidMount() {
        await this.getMovies();
    }

    getMovies = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/v1/movies');
            var movies = res.data
        } catch (error) {
            this.props.history.push("/error");
        }

        this.setState(() => ({
            movies
        }));
    }

    deleteMovie = async (e) => {
        const clickedMovie = e.target.parentNode.children[0].textContent;
        const result = this.state.movies.filter((movie) => {
            return movie.name === clickedMovie
        })[0];

        try {
            await axios.delete(`http://localhost:3001/api/v1/movies/${result.id}`);
        } catch (error) {
            this.props.history.push("/error");
        }

        this.getMovies();
    }

    render() {
        return (
            <div>
                <Row>
                    <Table responsive="md">
                        <tbody>
                            <tr>
                                <th>Title</th>
                                <th>Genre</th>
                                <th>Rating</th>
                                <th>Explicit</th>
                                <th></th>
                                <th></th>
                            </tr>
                            {
                                this.state.movies.length === 0 ? (
                                    <tr>
                                        <td>No movies to show</td>
                                    </tr>
                                ) : (
                                    this.state.movies.map((movie) => (
                                        <MovieTableRow
                                            movie={movie}
                                            key={movie.id}
                                            deleteMovie={this.deleteMovie}
                                        />
                                    ))
                                )
                            }
                        </tbody>
                    </Table>
                </Row>
            </div>
        )
    }
}

export default CustomTable;