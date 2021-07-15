import React from 'react';
import { Link } from 'react-router-dom';

const MovieTableRow = (props) => {

    return (
        <tr>
            <td>{props.movie.name}</td>
            <td>{props.movie.genre}</td>
            <td>{props.movie.rating}</td>
            <td>{props.movie.explicit === true ? "True" : "False"}</td>
            <td onClick={props.deleteMovie} className="delete-emoji">❌</td>
            <td>
                <Link to={`/movies/${props.movie.id}`}>🖊️</Link>
            </td>
        </tr>
    );

}

export default MovieTableRow;