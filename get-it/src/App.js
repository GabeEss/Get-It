import { HashRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import Homepage from "./components/pages/HomePage";
import Gamingpage from "./components/pages/GamingPage";
import Businesspage from "./components/pages/BusinessPage";
import Televisionpage from "./components/pages/TelevisionPage";
import { SearchProvider } from "./contexts/SearchContext";
import { SignUpProvider } from "./contexts/SignUpScreenContext";
import { LoginProvider } from "./contexts/LoginScreenContext";
import { ResetPasswordProvider } from "./contexts/ResetPasswordContext";

function App() {
  return (
    <HashRouter>
      <LoginProvider>
        <SignUpProvider>
          <ResetPasswordProvider>
            <SearchProvider>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/Gaming" element={<Gamingpage />} />
                <Route path="/Business" element={<Businesspage />} />
                <Route path="/Television" element={<Televisionpage />} />
              </Routes>
            </SearchProvider>
          </ResetPasswordProvider>
        </SignUpProvider>
      </LoginProvider>
    </HashRouter>
  );
}

export default App;
