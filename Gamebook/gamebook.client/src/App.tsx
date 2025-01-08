import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import { AuthProvider } from './providers/authProvider.tsx';
import SignInPage from './pages/SignInPage';
import ChoosingCharacter from './pages/ChoosingCharacter.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import TokenPage from './pages/TokenPage';
import StartPage from "./pages/StartPage";
import Pokusy from "./pages/Pokusy.tsx";
import RoomNavigation from "./pages/RoomNavigation.tsx";

// Definice tras
const router = createBrowserRouter([
  {
    path: "/", // Výchozí stránka
    element: <StartPage />,
  },
  {
    path: "/signin", // Přihlašovací stránka
    element: <SignInPage />,
  },
  {
    path: "/signup", // Registrace
    element: <SignUpPage />,
  },
  {
    path: "/choosingcharacter", // Hlavní hra
    element: <ChoosingCharacter />,
  },
  {
    path: "/token", // Token stránka
    element: <TokenPage />,
  },
  {
    path: "/pokusy", // Testovací stránka
    element: <Pokusy />,
  },
  {
    path: "/game", // Hlavní hra bez parametru
    element: <RoomNavigation />,
  },
  {
    path: "/game/:id", // Hlavní hra s ID místnosti
    element: <RoomNavigation />,
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
