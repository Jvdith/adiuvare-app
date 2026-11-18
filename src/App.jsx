import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import MyInscriptions from './pages/MyInscriptions';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import EventForm from './pages/EventForm';

const router = createBrowserRouter([
  
  { path: "/", element: <Layout><Welcome /></Layout> },
  { path: "/login", element: <Layout><Login /></Layout> },
  { path: "/register", element: <Layout><Register /></Layout> },
  { path: "/help", element: <Layout><Help /></Layout> },

  
  { path: "/home", element: <Layout><ProtectedRoute><Home /></ProtectedRoute></Layout> },
  { path: "/profile", element: <Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout> },
  { path: "/search", element: <Layout><ProtectedRoute><Search /></ProtectedRoute></Layout> },
  { path: "/favorites", element: <Layout><ProtectedRoute><Favorites /></ProtectedRoute></Layout> },
  { path: "/my-inscriptions", element: <Layout><ProtectedRoute><MyInscriptions /></ProtectedRoute></Layout> },
  { path: "/create-event", element: <Layout><ProtectedRoute><CreateEvent /></ProtectedRoute></Layout> },
  { path: "/edit-event/:id", element: <Layout><ProtectedRoute><EditEvent /></ProtectedRoute></Layout> },
  { path: "/event/:id", element: <Layout><ProtectedRoute><EventForm /></ProtectedRoute></Layout> },

  
  { path: "*", element: <Layout><NotFound /></Layout> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;