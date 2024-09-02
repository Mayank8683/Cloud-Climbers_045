import "./App.css";
import DocumentManager from "./components/DocumentManager";
import FolderManager from "./components/FolderManager";
import Navbar from "./components/Navbar";
import RichTextEditor from "./components/RichTextEditor";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import AllRoutes from "./routes/AllRoutes";

function App() {
  const { user } = useAuth();
  return (
    <>
      <Home user={user} />
    </>
  );
}

export default App;
