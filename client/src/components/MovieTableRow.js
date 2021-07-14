import React from 'react';
import { Link } from 'react-router-dom';

const MovieTableRow = (props) => {

    return (
        <tr>
            <td>{props.movie.name}</td>
            <td>{props.movie.genre}</td>
            <td>{props.movie.rating}</td>
            <td>{props.movie.explicit}</td>
            <td onClick={props.deleteMovie}>x</td>
            <td>
                <Link to={`/movies/${props.movie.id}`}>edit</Link>
            </td>
        </tr>
    );

}

export default MovieTableRow;