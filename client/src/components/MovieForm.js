import React from 'react';
import { Row, Button } from 'react-bootstrap';

const MovieForm = (props) => {
    return (
        <div className="mt-5">
            {props.error && <h4>{props.error}</h4>}
            <form action="" onSubmit={props.onSubmit}>
                <Row className="justify-content-center align-items-center">
                    <label className="col-md-2 align-text-bottom">Title</label>
                    <input
                        type="text"
                        placeholder="Title"
                        autoFocus
                        value={props.title}
                        onChange={props.onTitleChange}
                        className="col-md-6 my-2 mr-2"
                    />
                </Row>
                <Row className="justify-content-center align-items-center">
                    <label className="col-md-2 align-text-bottom">Genre</label>
                    <input
                        type="text"
                        placeholder="Genre"
                        value={props.genre}
                        onChange={props.onGenreChange}
                        className="col-md-6 my-2 mr-2"
                    />
                </Row>
                <Row className="justify-content-center align-items-center">
                    <label className="col-md-2 align-text-bottom">Rating</label>
                    <input
                        type="number"
                        placeholder="Rating"
                        value={props.rating}
                        onChange={props.onRatingChange}
                        className="col-md-6 my-2 mr-2"
                    />
                </Row>
                <Row className="justify-content-center align-items-center">
                    <label className="col-md-2 align-text-bottom">Explicit</label>
                    <select
                        value={props.explicit}
                        onChange={props.onExplicitChange}
                        className="col-md-6 my-2 mr-2"
                    >
                        <option value="true">True</option>
                        <option selected value="false">False</option>
                    </select>
                </Row>
                <Row className="justify-content-center my-3">
                    <Button type="submit" variant="light" className="col-6 col-md-2  border text-center">
                        Submit
                    </Button>
                </Row>
            </form>
        </div>
    )
}

export default MovieForm;