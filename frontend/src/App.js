import { AllRoutes } from "./routes/AllRoutes";
import { Navbar } from "./components/common/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: "1 1 auto" }}>
        <AllRoutes />
      </div>
      <Footer />
    </div>
  );
}

export default App;
