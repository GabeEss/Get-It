import React, {useState, useContext} from "react";
import { SearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";

const Searchbar = () => {
    const [searchText, setText] = useState("");
    const {setSearchTerm} = useContext(SearchContext);
    // If the page can be collected from the url, it means the user is on a post page.
    // Remove the searchbar if the user is on a post page.
    const {page} = useParams(); 

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setSearchTerm(searchText);
        setText("");
    };

    const handleSearchChange = (event) => {
        setText(event.target.value);
    };

    return(
        page ? <div className="searchbar-container hidden"></div> :
        <div className="searchbar-container">
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    placeholder="Search Get It..."
                    value={searchText}
                    onChange={handleSearchChange}
                    onSubmit={handleFormSubmit}
                />
            </form>
        </div>
    )
}

export default Searchbar;