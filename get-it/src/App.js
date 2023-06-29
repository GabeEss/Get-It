import { HashRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import Homepage from "./components/pages/HomePage";
import { SearchProvider } from "./contexts/SearchContext";
import { SignUpProvider } from "./contexts/SignUpScreenContext";
import { LoginProvider } from "./contexts/LoginScreenContext";

function App() {
  return (
    <HashRouter>
      <LoginProvider>
        <SignUpProvider>
          <SearchProvider>
            <Routes>
              <Route path="/" element={<Homepage />} />
            </Routes>
          </SearchProvider>
        </SignUpProvider>
      </LoginProvider>
    </HashRouter>
  );
}

export default App;
