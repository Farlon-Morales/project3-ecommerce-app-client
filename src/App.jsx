import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateProduct from "./pages/CreateProduct";
import "./App.css";
import Navbar from "./components/Navbar";
import ProductsList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-product" element={<CreateProduct />} />
      </Routes>
    </Router>
  );
}

export default App;