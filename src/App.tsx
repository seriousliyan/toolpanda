import { useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ToolPage from './pages/ToolPage';

function HomeLayout() {
  const [query, setQuery] = useState('');
  return (
    <>
      <Header query={query} onQueryChange={setQuery} />
      <HomePage query={query} />
    </>
  );
}

function ToolLayout() {
  return (
    <>
      <Header query="" onQueryChange={() => {}} />
      <ToolPage />
    </>
  );
}

const router = createBrowserRouter([
  { path: '/', element: <HomeLayout /> },
  { path: '/tools/:toolId', element: <ToolLayout /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
