import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "../assets/assets";
import ProductCard from "../Components/ProductCard";
import { useCatalogFilters } from "../hooks/useCatalogFilters";
import "./pages.css";

const categories = ["Men", "Women", "Kids"];

const Everything = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedTypes, setSelectedTypes] = useState(() => {
    const typeValue = searchParams.get("type");
    return typeValue ? [typeValue] : [];
  });
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || ""
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const { filteredProducts, types } = useCatalogFilters({
    products,
    selectedCategory,
    selectedTypes,
    searchTerm,
  });

  const toggleCategory = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    setSelectedTypes([]);
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((selectedType) => selectedType !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="shop-page">
      <div className="shop-container">
        <aside className="filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="button" onClick={() => setSearchTerm(inputValue)}>
              Search
            </button>
          </div>

          <h5>CATEGORIES</h5>
          <ul className="checkbox-list">
            {categories.map((category) => (
              <li key={category}>
                <label className={selectedCategory === category ? "checked" : ""}>
                  <input
                    type="checkbox"
                    checked={selectedCategory === category}
                    onChange={() => toggleCategory(category)}
                  />
                  {category}
                </label>
              </li>
            ))}
          </ul>

          {types.length > 0 && (
            <>
              <h5>TYPE</h5>
              <ul className="checkbox-list">
                {types.map((type) => (
                  <li key={type}>
                    <label
                      className={selectedTypes.includes(type) ? "checked" : ""}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                      />
                      {type}
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>

        <section className="products-wrapper">
          <h2>All Products</h2>
          <p>{filteredProducts.length} items found</p>

          <div className="products-section">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Everything;
