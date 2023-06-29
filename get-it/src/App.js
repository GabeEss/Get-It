import { HashRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import Homepage from "./components/pages/HomePage";
import SignUpPage from "./components/pages/SignUpPage";
import { SearchProvider } from "./contexts/SearchContext";

function App() {
  return (
    <HashRouter>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/SignUp" element={<SignUpPage/>} />
        </Routes>
      </SearchProvider>
    </HashRouter>
  );
}

export default App;
