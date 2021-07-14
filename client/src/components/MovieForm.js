import React from 'react';

const MovieForm = (props) => {
    return (
        <div>
            {props.error && <h4>{props.error}</h4>}
            <form action="" onSubmit={props.onSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    autoFocus
                    value={props.title}
                    onChange={props.onTitleChange}
                />
                <input
                    type="text"
                    placeholder="Genre"
                    value={props.genre}
                    onChange={props.onGenreChange}
                />
                <input
                    type="number"
                    placeholder="Rating"
                    value={props.rating}
                    onChange={props.onRatingChange}
                />
                <select
                    value={props.explicit}
                    onChange={props.onExplicitChange}>
                    <option value="true">True</option>
                    <option selected value="false">False</option>
                </select>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default MovieForm;