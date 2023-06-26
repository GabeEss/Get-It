import React, {useContext} from "react";
import { SearchContext } from "../../contexts/SearchContext";

const Searchbar = () => {
    const {search, setSearchTerm} = useContext(SearchContext);

    const handleFormSubmit = (event) => {
        event.preventDefault();
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return(
        <div className="searchbar-container">
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    placeholder="Search Get It..."
                    value={search}
                    onChange={handleSearchChange}
                    onSubmit={handleFormSubmit}
                />
            </form>
        </div>
    )
}

export default Searchbar;