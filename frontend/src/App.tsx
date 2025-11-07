import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <SearchProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Header />
          <main style={{ minHeight: "80vh", padding: "20px" }}>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </SearchProvider>
  );
}

export default App;
