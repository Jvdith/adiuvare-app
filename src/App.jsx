import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Help from './pages/Help';
import Search from './pages/Search';
import Notifications from './pages/Notifications';
import Favorites from './pages/Favorites';
import EventForm from './pages/EventForm';
import MyInscriptions from './pages/MyInscriptions';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';




const router = createBrowserRouter([
  { path: "/", element: <Layout><Welcome /></Layout> },
  { path: "/login", element: <Layout><Login /></Layout> },
  { path: "/register", element: <Layout><Register /></Layout> },
  { path: "/home", element: <Layout><Home /></Layout> },
  { path: "/help", element: <Layout><Help /></Layout> },
  { path: "/profile", element: <Layout><Profile /></Layout> },
  { path: "*", element: <Layout><NotFound /></Layout> },
  { path: "/search", element: <Layout><Search /></Layout> },
  { path: "/notifications", element: <Layout><Notifications /></Layout> },
  { path: "/favorites", element: <Layout><Favorites /></Layout> },
  { path: "/event/:id", element: <Layout><EventForm /></Layout> },
  { path: "/my-inscriptions", element: <Layout><MyInscriptions /></Layout> },
  { path: "/create-event", element: <Layout><CreateEvent /></Layout> },
  { path: "/edit-event/:id", element: <Layout><EditEvent /></Layout> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;