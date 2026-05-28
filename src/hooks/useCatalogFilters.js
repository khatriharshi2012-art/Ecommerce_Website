import { useMemo } from "react";

export const getTypesFromParam = (value) =>
  value ? value.split(",").filter(Boolean) : [];

export const useCatalogFilters = ({
  products,
  category = "",
  selectedCategory = "",
  selectedTypes = [],
  searchTerm = "",
}) =>
  useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const activeCategory = category || selectedCategory;

    const filteredProducts = products.filter((product) => {
      const matchesCategory = !activeCategory || product.category === activeCategory;
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(product.subCategory);
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesType && matchesSearch;
    });

    const types = [
      ...new Set(
        products
          .filter((product) =>
            activeCategory ? product.category === activeCategory : true
          )
          .map((product) => product.subCategory)
      ),
    ];

    return { filteredProducts, types };
  }, [category, products, searchTerm, selectedCategory, selectedTypes]);
