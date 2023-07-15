import { HashRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import Homepage from "./components/pages/HomePage";
import Gamingpage from "./components/pages/GamingPage";
import Businesspage from "./components/pages/BusinessPage";
import Televisionpage from "./components/pages/TelevisionPage";
import Postpage from "./components/pages/PostPage";
import Accountpage from "./components/pages/AccountPage";
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
                  <Route path="/gaming" element={<Gamingpage />} />
                  <Route path="/business" element={<Businesspage />} />
                  <Route path="/television" element={<Televisionpage />} />
                  <Route path=":page/:title/:id" element={<Postpage />} />
                  <Route path="/account" element={<Accountpage />} />
                </Routes>
              </SearchProvider>
          </ResetPasswordProvider>
        </SignUpProvider>
      </LoginProvider>
    </HashRouter>
  );
}

export default App;
