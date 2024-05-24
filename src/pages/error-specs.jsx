import React from "react";

export default function ErrorSpecs({errorInfo}) {

    return (
        <>
            <section className="error-specs-page">
                <div>{errorInfo}</div>
                <p>Here are some common HTTP status codes:</p>

                <ul>
                    <li> 200-299: Success</li>
                    <li>400-499: Client Error (e.g., invalid request, missing parameters)</li>
                    <li>500-599: Server Error (e.g., internal server error, database error)</li>
                </ul>
                <p>result = await fetch() 
                    <br />
                    result.status gives access to the result object
                </p>
            </section>
        </>
    )
}