export const formatPrice = (value, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

export const getPrimaryImage = (image) =>
  Array.isArray(image) ? image[0] : image;
