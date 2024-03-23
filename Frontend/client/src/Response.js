import React from 'react';

function Response({ pdfFolders, resText }) {
    return (
        <div>
            <form action="/ask" method="GET">
                <input type="text" name="question" id="question" placeholder="Enter your question" />
                <select name="pdf" id="pdf">
                    {pdfFolders.map(pdf => (
                        <option key={pdf} value={pdf}>{pdf}</option>
                    ))}
                </select>
                <button type="submit">Submit</button>
            </form>

            <h1 className="hello">{resText}</h1>
        </div>
    );
}

export default Response;
