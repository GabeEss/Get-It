import { HashRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import Homepage from "./components/pages/HomePage";
import Gamingpage from "./components/pages/GamingPage";
import Businesspage from "./components/pages/BusinessPage";
import Televisionpage from "./components/pages/TelevisionPage";
import Postpage from "./components/pages/PostPage";
import Accountpage from "./components/pages/AccountPage";
import { CurrentPageProvider } from "./contexts/CurrentPageContext";
import { SearchProvider } from "./contexts/SearchContext";
import { SignUpProvider } from "./contexts/SignUpScreenContext";
import { UserProvider } from "./contexts/UserContext";
import { LoginProvider } from "./contexts/LoginScreenContext";
import { ResetPasswordProvider } from "./contexts/ResetPasswordContext";
import { RefreshPostsProvider } from "./contexts/RefreshPostsContext";
import { RefreshCommentsProvider } from "./contexts/RefreshCommentsContext";
import { EditProvider } from "./contexts/EditPostContext";
import { EditCommentProvider } from "./contexts/EditCommentContext";
import { RecentProvider } from "./contexts/RecentContext";

function App() {
  return (
    <HashRouter>
      <UserProvider>
        <CurrentPageProvider>
          <RecentProvider>
            <LoginProvider>
              <SignUpProvider>
                <ResetPasswordProvider>
                  <RefreshPostsProvider>
                    <RefreshCommentsProvider>
                        <SearchProvider>
                          <EditProvider>
                            <EditCommentProvider>
                              <Routes>
                                <Route path="/" element={<Homepage />} />
                                <Route path="/gaming" element={<Gamingpage />} />
                                <Route path="/business" element={<Businesspage />} />
                                <Route path="/television" element={<Televisionpage />} />
                                <Route path=":page/:title/:id" element={<Postpage />} />
                                <Route path="/account" element={<Accountpage />} />
                              </Routes>
                            </EditCommentProvider>
                          </EditProvider>
                        </SearchProvider>
                      </RefreshCommentsProvider>
                    </RefreshPostsProvider>
                </ResetPasswordProvider>
              </SignUpProvider>
            </LoginProvider>
          </RecentProvider>
        </CurrentPageProvider>
      </UserProvider>
    </HashRouter>
  );
}

export default App;
