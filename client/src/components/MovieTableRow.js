import React from 'react';

const MovieTableRow = (props) => {

    return (
        <tr>
            <td>{props.movie.name}</td>
            <td>{props.movie.genre}</td>
            <td>{props.movie.rating}</td>
            <td>{props.movie.explicit}</td>
            <td onClick={props.deleteMovie}>x</td>
            <td>{props.movie.id}</td>
        </tr>
    );

}

export default MovieTableRow;