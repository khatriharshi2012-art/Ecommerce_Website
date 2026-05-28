import ProductCard from "./ProductCard";
import "./components.css";

const LatestCollection = ({ products }) => {
  return (
    <div className="latest-container">
      <h2 className="latest-title fw-bold">Latest Collection</h2>

      <div className="latest-grid">
        {products.slice(10, 20).map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
