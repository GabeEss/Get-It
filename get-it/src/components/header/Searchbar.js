import React, {useState, useContext} from "react";
import { SearchContext } from "../../contexts/SearchContext";

const Searchbar = () => {
    const [searchText, setText] = useState("");
    const {setSearchTerm} = useContext(SearchContext);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setSearchTerm(searchText);
        setText("");
    };

    const handleSearchChange = (event) => {
        setText(event.target.value);
    };

    return(
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