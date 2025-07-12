import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="post/:id" element={<PostDetail />} />
    </>
  )
)

export default router
