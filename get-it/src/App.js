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
import { EditDisplayNameProvider } from "./contexts/EditDisplayNameContext";
import { LightDarkProvider } from "./contexts/LightDarkContext";
import { CreatePostProvider } from "./contexts/CreatePostContext";

function App() {
  return (
    <HashRouter>
      <LightDarkProvider>
        <UserProvider>
          <EditDisplayNameProvider>
            <CurrentPageProvider>
              <RecentProvider>
                <LoginProvider>
                  <SignUpProvider>
                    <ResetPasswordProvider>
                      <CreatePostProvider>
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
                        </CreatePostProvider>
                    </ResetPasswordProvider>
                  </SignUpProvider>
                </LoginProvider>
              </RecentProvider>
            </CurrentPageProvider>
          </EditDisplayNameProvider>
        </UserProvider>
      </LightDarkProvider>
    </HashRouter>
  );
}

export default App;
