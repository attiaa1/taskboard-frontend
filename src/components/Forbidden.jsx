import React from "react";
import { Link } from "react-router-dom";

const Forbidden = () => {
    return(
        <>
        <h2> You are not allowed to see this page without logging in. </h2>
        <h3> Please <Link to='/login'>login</Link> to gain access.</h3>
        </>
    );
};

export default Forbidden;