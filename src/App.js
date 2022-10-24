import Weather from "./components/Weather";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <main className="center-flex">
      <Weather />
      <ToastContainer position="top-center" autoClose={3000} pauseOnFocusLoss={false} />
    </main>
  );
}

export default App;