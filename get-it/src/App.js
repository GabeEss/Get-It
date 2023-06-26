import { HashRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/pages/HomePage";
import { SearchProvider } from "./contexts/SearchContext";

function App() {
  return (
    <HashRouter>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </SearchProvider>
    </HashRouter>
  );
}

export default App;
