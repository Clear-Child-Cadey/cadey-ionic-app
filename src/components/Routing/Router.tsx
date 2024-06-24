import React, { useEffect } from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
// CSS
import './Router.css';
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
import BlogCategoryListingPage from '../../pages/Blog/BlogCategoryListing';
import BlogPage from '../../pages/Blog/BlogListing';
import BlogDetailPage from '../../pages/Blog/BlogDetail';
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
import AppUrlListener from './AppUrlListener';
import RedirectToWeb from './RedirectToWeb';
import OneSignalInitializer from '../../api/OneSignal/OneSignalInitializerComponent';
// Interfaces
import MessagesPage from '../../pages/Messages/Messages';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  setRoute,
  setVideoId,
  setArticleId,
  setBlogId,
} from '../../features/deepLinks/slice';
import { trileanResolve } from '../../types/Trilean';
import AppMeta from '../../variables/AppMeta';
import VerificationPage from '../VerificationMessage';
import BadUser from '../Authentication/BadUser';
import AccountPage from '../../pages/Account/Account';
import ProtectedRoute from './ProtectedRoute';
import { useTabContext } from '../../context/TabContext';
import { logUserFact } from '../../api/UserFacts';
import { useAppPage } from '../../context/AppPageContext';
import { personOutline } from 'ionicons/icons';
import { LibraryIcon } from '../../svgs/NavLibrary';
import { PathsIcon } from '../../svgs/NavPaths';
import { HomeIcon } from '../../svgs/NavHome';
import ContactPage from '../../pages/Account/Contact';
import PurchaseSubPage from '../../pages/Subscriptions/PurchaseSub';
import DeleteAccountPage from '../../pages/Account/DeleteAccount';
import WebinarDetailPage from '../../pages/Webinars/WebinarDetail';
import WebinarPage from '../../pages/Webinars/WebinarListing';

const Router: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentAppPage } = useAppPage();
  const history = useHistory();

  // Tab bar visibility
  const { isTabBarVisible, setIsTabBarVisible } = useTabContext();

  const regStatus = useSelector((state: RootState) => {
    return state?.authStatus?.userData?.cadeyUser?.regStatus;
  });
  const authStatus = useSelector((state: RootState) => {
    return state?.authStatus?.userData?.cadeyUser?.authStatus;
  });

  // reference from Ron's code
  // regstatus
  //     0 = Registered
  //     1 = NotFound
  //     2 = FoundNotRegistered
  //     3 = PendingDeletion
  // authstatus
  //     0 = Successful
  //     1 = FailedExpired
  //     2 = FailedNotActive
  //     3 = FailedNotRegistered
  //     4 = PendingDeletion

  // goodUser is used to:
  //     Show the BadUser component if there's anything wrong with a user
  const goodUser = useSelector((state: RootState) => {
    return (
      state?.authStatus?.userData?.cadeyUser?.regStatus === 0 &&
      state?.authStatus?.userData?.cadeyUser?.authStatus === 0
    );
  });
  const aCadeyUserHasBeenReturned = useSelector((state: RootState) => {
    return state?.authStatus?.userData?.cadeyUser !== null;
  });
  const cadeyUser = useSelector((state: RootState) => {
    return state?.authStatus?.userData?.cadeyUser;
  });
  const emailVerified = useSelector((state: RootState) => {
    return (
      state.authStatus?.emailVerified ||
      state.authStatus?.userData?.firebaseUser?.emailVerified
    );
  });
  const aUserExists = useSelector((state: RootState) => {
    return state?.authStatus?.userData?.cadeyUser !== null;
  });
  // A user is logged in if they have a non-anonymous Firebase user and a Cadey user
  const userLoggedIn = useSelector((state: RootState) => {
    return (
      state.authStatus.userData.firebaseUser !== null &&
      !state.authStatus.userData.firebaseUser.isAnonymous &&
      state.authStatus.userData.cadeyUser !== null
    );
  });
  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId;
  });

  useEffect(() => {
    // This effect runs when the location or dispatch changes
    const queryParams = new URLSearchParams(location.search);
    const videoId = queryParams.get('video');
    const articleId = queryParams.get('article');
    const blogId = queryParams.get('blog');

    if (videoId || articleId || blogId) {
      // Dispatch Redux actions to update the state
      dispatch(setRoute(location.pathname));
      if (videoId) dispatch(setVideoId(videoId));
      if (articleId) dispatch(setArticleId(articleId));
      if (blogId) dispatch(setBlogId(blogId));
    }

    // Set the tab bar visibility based on the current path
    setIsTabBarVisible(
      location.pathname.includes('/App/Home') ||
        location.pathname.includes('/App/Library') ||
        location.pathname.includes('/App/Paths') ||
        location.pathname.includes('/App/Account') ||
        location.pathname.includes('/App/Admin'),
    );
  }, [location, dispatch]); // Depend on location and dispatch to re-run this effect

  const handleTabClick = async (tabName: string, route: string) => {
    // Log user fact that the user clicked on the tap bar
    logUserFact({
      cadeyUserId: cadeyUserId || 0,
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

  {
    /* Show the BadUser component if there's anything wrong with a user */
  }
  if (aCadeyUserHasBeenReturned && !goodUser) {
    return <BadUser authStatus={authStatus} regStatus={regStatus} />;
  }

  return (
    <>
      {/* Listen for App URLs */}
      <AppUrlListener></AppUrlListener>

      {/* Initialize OneSignal and listen for OneSignal callbacks */}
      {window.cordova && <OneSignalInitializer />}

      {aUserExists &&
        goodUser &&
        AppMeta.forceEmailVerification &&
        !trileanResolve(emailVerified) && <VerificationPage />}

      <IonTabs>
        {/* Handle all routes */}
        <IonRouterOutlet>
          <Switch>
            /* Startup route */
            <Route exact path='/'>
              {userLoggedIn ? (
                <Redirect to='/App/Home' />
              ) : (
                <Redirect to='/App/Welcome' />
              )}
            </Route>
            {/* Welcome sequence routes */}
            <Route exact path='/App/Welcome' component={WelcomePage} />
            <ProtectedRoute
              exact
              path='/App/Welcome/Path'
              component={WelcomePathSelect}
              enforceLoggedIn={true}
            />
            <ProtectedRoute
              exact
              path='/App/Welcome/AgeGroup'
              component={WelcomeAgeGroupSelect}
              enforceLoggedIn={true}
            />
            <ProtectedRoute
              exact
              path='/App/Welcome/Push'
              component={WelcomePush}
              enforceLoggedIn={true}
            />
            {/* Authentication routes */}
            <Route exact path='/App/Authentication' component={HandlerPage} />
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
            {/* Home routes */}
            <ProtectedRoute
              exact
              path='/App/Home'
              enforceLoggedIn={true}
              enforcePro={true}
              render={(routeProps) => {
                const vimeoId = routeProps.location.search.split('video=')[1];
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
            <ProtectedRoute
              path='/App/Home/Messages'
              component={MessagesPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            {/* Library routes */}
            <ProtectedRoute
              exact
              path='/App/Library'
              component={LibraryPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            <ProtectedRoute
              exact
              path='/App/Library/Search'
              component={SearchPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            <ProtectedRoute
              exact
              path='/App/Library/Articles'
              component={ArticleCategoryListingPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            <ProtectedRoute
              exact
              path='/App/Library/Articles/Category'
              component={ArticlesPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            <ProtectedRoute
              exact
              path='/App/Library/Articles/Article'
              component={ArticleDetailPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            <ProtectedRoute
              exact
              path='/App/Library/Blog'
              component={BlogCategoryListingPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            <ProtectedRoute
              exact
              path='/App/Library/Blog/Category'
              component={BlogPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            <ProtectedRoute
              exact
              path='/App/Library/Blog/Article'
              component={BlogDetailPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            <ProtectedRoute
              exact
              path='/App/Library/Webinars'
              component={WebinarPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            <ProtectedRoute
              exact
              path='/App/Library/Webinars/Article'
              component={WebinarDetailPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            <ProtectedRoute
              exact
              path='/App/Library/Videos'
              component={VideoLibraryPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            {/* Paths routes */}
            <Route exact path='/App/Paths'>
              <Redirect to='/App/Paths/PathListing' />
            </Route>
            <ProtectedRoute
              exact
              path='/App/Paths/PathListing'
              component={PathListingPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            <ProtectedRoute
              exact
              path='/App/Paths/PathDetail'
              component={PathDetailPage}
              enforceLoggedIn={true}
              enforcePro={true}
            />
            {/* Account Routes */}
            <ProtectedRoute
              exact
              path='/App/Account'
              component={AccountPage}
              enforceLoggedIn={true}
              enforcePro={false}
            />
            <ProtectedRoute
              exact
              path='/App/Account/Contact'
              component={ContactPage}
              enforceLoggedIn={true}
              enforcePro={false}
            />
            {/* Subscription Routes */}
            <ProtectedRoute
              exact
              path='/App/Account/Subscription/Purchase'
              component={PurchaseSubPage}
              enforceLoggedIn={true}
              enforcePro={false}
            />
            <ProtectedRoute
              exact
              path='/App/Account/Delete'
              component={DeleteAccountPage}
              enforceLoggedIn={true}
              enforcePro={false}
            />
            {/* Catch-all route - redirect to web (cadey.co, articles, contact us, etc) */}
            {/* <Route component={RedirectToWeb} /> */}
          </Switch>
        </IonRouterOutlet>

        {/* Add the TabBar component */}
        {/* Tab Bar should only be visible if the flag is true */}
        <IonTabBar
          slot='bottom'
          className={`tab-bar ${!isTabBarVisible ? 'hidden' : ''}`}
        >
          <IonTabButton
            tab='Home'
            onClick={() => handleTabClick('Home', '/App/Home')}
            selected={isTabActive('/App/Home')}
          >
            <HomeIcon />
            <IonLabel className='tab-bar-label'>Home</IonLabel>
          </IonTabButton>

          {/* Paths */}
          <IonTabButton
            tab='Paths'
            onClick={() => handleTabClick('Path Listing', '/App/Paths')}
            selected={isTabActive('/App/Paths')}
          >
            <PathsIcon />
            <IonLabel className='tab-bar-label'>Paths</IonLabel>
          </IonTabButton>

          {/* Library */}
          <IonTabButton
            tab='Library'
            onClick={() => handleTabClick('Library', '/App/Library')}
            selected={isTabActive('/App/Library')}
          >
            <LibraryIcon />
            <IonLabel className='tab-bar-label'>Library</IonLabel>
          </IonTabButton>

          {/* Account */}
          <IonTabButton
            tab='Account'
            onClick={() => handleTabClick('Account', '/App/Account')}
            selected={isTabActive('/App/Account')}
          >
            <IonIcon
              icon={personOutline}
              className='account-icon tab-bar-icon'
            />
            <IonLabel className='tab-bar-label'>Account</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </>
  );
};

export default Router;
