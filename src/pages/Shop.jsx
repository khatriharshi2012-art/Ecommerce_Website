import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "../assets/assets";
import ProductCard from "../Components/ProductCard";
import { getTypesFromParam, useCatalogFilters } from "../hooks/useCatalogFilters";
import "./pages.css";

const Shop = ({ category }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const selectedTypes = useMemo(
    () => getTypesFromParam(searchParams.get("type")),
    [searchParams]
  );

  const { filteredProducts, types } = useCatalogFilters({
    products,
    category,
    selectedTypes,
    searchTerm: search,
  });

  const toggleType = (type) => {
    const updatedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((selectedType) => selectedType !== type)
      : [...selectedTypes, type];

    setSearchParams({
      ...(search && { search }),
      ...(updatedTypes.length > 0 && { type: updatedTypes.join(",") }),
    });
  };

  return (
    <div className="shop-page">
      <div className="shop-container">
        <div className="filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearchParams({
                  ...(selectedTypes.length > 0 && {
                    type: selectedTypes.join(","),
                  }),
                  search: e.target.value,
                })
              }
            />
            <button type="button">Search</button>
          </div>

          <h5>TYPE</h5>
          <ul className="checkbox-list">
            {types.map((type) => (
              <li key={type}>
                <label className={selectedTypes.includes(type) ? "checked" : ""}>
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
        </div>

        <div className="products-wrapper">
          <h2>{category} Products</h2>
          <p>{filteredProducts.length} items found</p>

          <div className="products-section">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
