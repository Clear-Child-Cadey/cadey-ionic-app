import React, { useState, useContext, useEffect } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useHistory,
} from 'react-router-dom';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
  IonButton,
} from '@ionic/react';
// CSS
import './RouterTabs.css';
// Icons
import { HomeIcon } from '../../svgs/NavHome';
import { PathsIcon } from '../../svgs/NavPaths';
import { LibraryIcon } from '../../svgs/NavLibrary';
// Pages
import HomePage from '../../pages/Home/Home';
import AdminPage from '../../pages/Admin/Admin';
import LibraryPage from '../../pages/Library/Library';
import SearchPage from '../../pages/Search/Search';
import PathListingPage from '../../pages/Paths/PathListing';
import PathDetailPage from '../../pages/Paths/PathDetail';
import ArticleCategoryListingPage from '../../pages/Articles/ArticleCategoryListing';
import ArticlesPage from '../../pages/Articles/ArticleListing';
import ArticleDetailPage from '../../pages/Articles/ArticleDetail';
import VideoLibraryPage from '../../pages/Library/VideoLibrary';
import WelcomePage from '../../pages/Welcome/Welcome';
import WelcomePathSelect from '../../pages/Welcome/WelcomePathSelect';
import WelcomeAgeGroupSelect from '../../pages/Welcome/WelcomeAgeGroup';
import WelcomePush from '../../pages/Welcome/WelcomePush';
import LoginPage from '../../pages/Authentication/Login';
import RegistrationPage from '../../pages/Authentication/Register';
import RegistrationSelectPage from '../../pages/Authentication/RegisterSelect';
import HandlerPage from '../../pages/Authentication/Handler';
import GrandfatherPage from '../../pages/Grandfather/Grandfather';
// Components
import AppUrlListener from '../Routing/AppUrlListener';
import RedirectToWeb from './RedirectToWeb';
import OneSignalInitializer from '../../api/OneSignal/OneSignalInitializerComponent';
// Contexts
import { useTabContext } from '../../context/TabContext';
import ApiUrlContext from '../../context/ApiUrlContext';
import { CadeyUserContext } from '../../main';
import { useAppPage } from '../../context/AppPageContext';
// Interfaces
import MessagesPage, { Message } from '../../pages/Messages/Messages';
import { logUserFact } from '../../api/UserFacts';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  setRoute,
  setVideoId,
  setArticleId,
} from '../../features/deepLinks/slice';
import { trileanResolve } from '../../types/Trilean';
import useCadeyAuth from '../../hooks/useCadeyAuth';
import AppMeta from '../../variables/AppMeta';
import VerificationPage from '../VerificationMessage';
import ExpiredUser from '../Authentication/ExpiredUser';

const RouterTabs: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const userLoggedIn = useSelector((state: RootState) => {
    return (
      state.authStatus.userData.firebaseUser !== null &&
      !state.authStatus.userData.firebaseUser.isAnonymous &&
      state.authStatus.userData.cadeyUser !== null
    );
  });

  const authStatus = useSelector((state: RootState) => {
    return state?.authStatus?.userData?.cadeyUser?.authStatus;
  });

  // reference from Ron's code
  // regstatus
  //
  //     0 = Registered
  //     1 = NotFound
  //     2 = FoundNotRegistered
  //
  // authstatus
  //
  //     0 = Successful
  //     1 = FailedExpired
  //     2 = FailedNotActive
  //     3 = FailedNotRegistered
  //
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    // const regStatus = state?.authStatus?.userData?.cadeyUser?.regStatus;
    // not sure what to do with regstatus...
    setIsExpired(!!authStatus && authStatus >= 1);
  }, [authStatus]);

  const aUserHasBeenReturned = useSelector((state: RootState) => {
    return state?.authStatus?.userData?.cadeyUser !== null;
  });

  const emailVerified = useSelector((state: RootState) => {
    return (
      state.authStatus?.emailVerified ||
      state.authStatus?.userData?.firebaseUser?.emailVerified
    );
  });

  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId;
  });

  const aUserExists = useSelector((state: RootState) => {
    return state?.authStatus?.userData?.cadeyUser !== null;
  });

  const grandfatherStatus = useSelector((state: RootState) => {
    return state.authStatus.grandfatherStatus;
  });

  // Tab bar visibility
  const { isTabBarVisible, setIsTabBarVisible } = useTabContext();

  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
  const { currentAppPage } = useAppPage();
  const [isWelcomeSequence, setIsWelcomeSequence] = useState(false);

  useEffect(() => {
    if (
      !userLoggedIn &&
      !AppMeta.nonLoggedInUsersAllowedPaths.includes(location.pathname) &&
      !AppMeta.forceEmailVerification
    ) {
      // Capture the current path so we can redirect the user back to it after they log in

      history.push('/App/Welcome');
    }
  }, [userLoggedIn, location, AppMeta]);

  // Use effect to update setIsWelcomeSequence
  useEffect(() => {
    // Update the state based on the current path
    setIsWelcomeSequence(location.pathname.startsWith('/App/Welcome'));

    setIsTabBarVisible(
      location.pathname.includes('/App/Home') ||
        location.pathname.includes('/App/Library') ||
        location.pathname.includes('/App/Paths'),
    );
  }, [location]);

  useEffect(() => {
    // This effect runs when the location changes
    const queryParams = new URLSearchParams(location.search);
    const videoId = queryParams.get('video');
    const articleId = queryParams.get('article');

    console.log('videoId:', videoId);
    console.log('articleId:', articleId);

    if (videoId || articleId) {
      // Dispatch Redux actions to update the state
      dispatch(setRoute(location.pathname));
      if (videoId) dispatch(setVideoId(videoId));
      if (articleId) dispatch(setArticleId(articleId));
    }
  }, [location, dispatch]); // Depend on location and dispatch to re-run this effect

  const handleTabClick = async (tabName: string, route: string) => {
    // Log user fact that the user clicked on the tap bar
    logUserFact({
      cadeyUserId: cadeyUserId,
      baseApiUrl: apiUrl,
      userFactTypeName: 'TapBarNavClick',
      appPage: currentAppPage,
      detail1: tabName,
    });

    history.push(route);
  };

  // Determine if a tab should be highlighted based on the current path
  const isTabActive = (tabPath: string): boolean => {
    // You might need more sophisticated logic depending on your routes
    return location.pathname.startsWith(tabPath);
  };
  return (
    <>
      {/* Listen for App URLs */}
      <AppUrlListener></AppUrlListener>

      {/* Initialize OneSignal and listen for OneSignal callbacks */}
      {window.cordova && <OneSignalInitializer />}

      {aUserHasBeenReturned && isExpired && <ExpiredUser />}

      {/* If the tab bar is not visible, the user is in the welcome sequence and should not see tabs */}
      {!isTabBarVisible && !isExpired && (
        <IonRouterOutlet>
          <Switch>
            {/* If the user is in the welcome sequence, show the welcome page */}

            <Route exact path='/App/Welcome' component={WelcomePage} />

            <Route exact path='/'>
              <Redirect to='/App/Welcome' />
            </Route>

            {/* Welcome sequence routes */}
            <Route
              exact
              path='/App/Welcome/Path'
              component={WelcomePathSelect}
            />
            <Route
              exact
              path='/App/Welcome/AgeGroup'
              component={WelcomeAgeGroupSelect}
            />
            <Route exact path='/App/Welcome/Push' component={WelcomePush} />

            <Route
              exact
              path='/App/Authentication/Login'
              component={LoginPage}
            />

            <Route
              exact
              path='/App/Authentication/Register'
              component={RegistrationPage}
            />
            <Route
              exact
              path='/App/Authentication/Register-Select'
              component={RegistrationSelectPage}
            />

            <Route exact path='/App/Grandfather' component={GrandfatherPage} />

            {/* Miscellaneous routes */}
            <Route exact path='/App/Admin' component={AdminPage} />

            {/* Route for handler to handle all deep links */}
            <Route exact path='/App/Authentication' component={HandlerPage} />

            <Route exact path='/App/Home'>
              <Redirect to='/App/Authentication/Login' />
            </Route>
          </Switch>
        </IonRouterOutlet>
      )}

      {isTabBarVisible &&
        !isExpired &&
        aUserExists &&
        (AppMeta.forceEmailVerification && !trileanResolve(emailVerified) ? (
          <VerificationPage />
        ) : (
          // If the tab bar is visible, show the tabs
          <IonTabs>
            <IonRouterOutlet>
              <Switch>
                {/* Define all of the specific routes */}

                {/* Home routes */}
                <Route
                  exact
                  path='/App/Home'
                  render={(routeProps) => {
                    const vimeoId =
                      routeProps.location.search.split('video=')[1];
                    const articleId =
                      routeProps.location.search.split('article=')[1];

                    return (
                      <HomePage
                        vimeoIdFromUrl={vimeoId} // Pass extracted videoId to the HomePage component
                        articleIdFromUrl={articleId} // Pass extracted articleId to the HomePage component
                      />
                    );
                  }}
                />
                <Route exact path='/'>
                  <Redirect to='/App/Home' />
                </Route>
                <Route path='/App/Home/Messages' component={MessagesPage} />

                {/* Library routes */}
                <Route exact path='/App/Library' component={LibraryPage} />
                <Route
                  exact
                  path='/App/Library/Search'
                  component={SearchPage}
                />
                <Route
                  exact
                  path='/App/Library/Articles'
                  component={ArticleCategoryListingPage}
                />
                <Route
                  exact
                  path='/App/Library/Articles/Category'
                  component={ArticlesPage}
                />
                <Route
                  exact
                  path='/App/Library/Articles/Article'
                  component={ArticleDetailPage}
                />
                <Route
                  exact
                  path='/App/Library/Videos'
                  component={VideoLibraryPage}
                />

                {/* Paths routes */}
                <Route exact path='/App/Paths'>
                  <Redirect to='/App/Paths/PathListing' />
                </Route>
                <Route
                  exact
                  path='/App/Paths/PathListing'
                  component={PathListingPage}
                />
                <Route
                  exact
                  path='/App/Paths/PathDetail'
                  component={PathDetailPage}
                />

                {/* Miscellaneous routes */}
                <Route exact path='/App/Admin' component={AdminPage} />

                {/* Re-route any route with "/App/Welcome" to the home screen */}
                <Route path='/App/Welcome'>
                  <Redirect to='/App/Home' />
                </Route>

                {/* Catch-all route - redirect to web (cadey.co, articles, contact us, etc) */}
                <Route component={RedirectToWeb} />
              </Switch>
            </IonRouterOutlet>
            {/* Tab Bar */}
            <IonTabBar
              slot='bottom'
              className={`tab-bar ${isWelcomeSequence ? 'welcome' : ''}`}
            >
              <IonTabButton
                tab='Home'
                onClick={() => handleTabClick('Home', '/App/Home')}
                selected={isTabActive('/App/Home')}
              >
                <HomeIcon />
                <IonLabel>Home</IonLabel>
              </IonTabButton>

              {/* Paths */}
              <IonTabButton
                tab='Paths'
                onClick={() => handleTabClick('Path Listing', '/App/Paths')}
                selected={isTabActive('/App/Paths')}
              >
                <PathsIcon />
                <IonLabel>Paths</IonLabel>
              </IonTabButton>

              {/* Library */}
              <IonTabButton
                tab='Library'
                onClick={() => handleTabClick('Library', '/App/Library')}
                selected={isTabActive('/App/Library')}
              >
                <LibraryIcon />
                <IonLabel>Library</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        ))}
    </>
  );
};

export default RouterTabs;
