import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../axios";

const initialProduct = {
    name: "",
    brand: "",
    desc: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    available: true
};

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(initialProduct);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch existing product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setFetching(true);
                setError("");

                const response = await API.get(`/products/${id}`);
                const data = response.data;

                setProduct({
                    name: data.name ?? "",
                    brand: data.brand ?? "",
                    desc: data.desc ?? "",
                    price: data.price ?? "",
                    category: data.category ?? "",
                    stockQuantity: data.stockQuantity ?? 0,
                    releaseDate: data.releaseDate ?? "",
                    available: data.available ?? false
                });

            } catch (err) {
                console.error("Fetch Product Error:", err);
                setError(
                    err.response?.data?.message ||
                    "Unable to load product details. Please check the product ID and backend."
                );
            } finally {
                setFetching(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Cleanup image preview URL
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setProduct((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        setError("");
        setMessage("");

        if (!file) {
            setImage(null);
            setImagePreview(null);
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Only JPG, PNG and WEBP images are allowed.");
            e.target.value = "";
            setImage(null);
            setImagePreview(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");
            e.target.value = "";
            setImage(null);
            setImagePreview(null);
            return;
        }

        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    // Update product
    const submitHandler = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (loading) return;

        if (!product.name.trim()) {
            setError("Please enter product name.");
            return;
        }

        if (!product.brand.trim()) {
            setError("Please enter product brand.");
            return;
        }

        if (!product.desc.trim()) {
            setError("Please enter product description.");
            return;
        }

        const price = Number(product.price);
        const stockQuantity = Number(product.stockQuantity);

        if (
            product.price === "" ||
            !Number.isFinite(price) ||
            price <= 0
        ) {
            setError("Please enter a valid product price.");
            return;
        }

        if (!product.category) {
            setError("Please select a category.");
            return;
        }

        if (
            product.stockQuantity === "" ||
            !Number.isInteger(stockQuantity) ||
            stockQuantity < 0
        ) {
            setError("Please enter a valid stock quantity.");
            return;
        }

        if (!product.releaseDate) {
            setError("Please select release date.");
            return;
        }

        const productData = {
            name: product.name.trim(),
            brand: product.brand.trim(),
            desc: product.desc.trim(),
            price,
            category: product.category,
            stockQuantity,
            releaseDate: product.releaseDate,
            available: product.available
        };

        const formData = new FormData();

        formData.append(
            "product",
            new Blob(
                [JSON.stringify(productData)],
                { type: "application/json" }
            )
        );

        // Image is optional when updating
        if (image) {
            formData.append("imageFile", image);
        }

        try {
            setLoading(true);

            const response = await API.put(
                `/products/${id}`,
                formData
            );

            console.log("Product updated:", response.data);

            setMessage("Product updated successfully!");

            setTimeout(() => {
                navigate(`/product/${id}`);
            }, 1000);

        } catch (err) {
            console.error("Update Product Error:", err);

            const responseData = err.response?.data;

            let errorMessage =
                "Something went wrong while updating the product.";

            if (typeof responseData === "string") {
                errorMessage = responseData;
            } else if (responseData?.message) {
                errorMessage = responseData.message;
            } else if (responseData) {
                errorMessage = JSON.stringify(responseData);
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (fetching) {
        return (
            <div style={styles.container}>
                <h2>Loading Product Details...</h2>
            </div>
        );
    }

    // Form
    return (
        <div style={styles.container}>

            <h2 style={styles.heading}>Update Product</h2>

            {message && (
                <div style={styles.success}>
                    {message}
                </div>
            )}

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            <form onSubmit={submitHandler}>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleInputChange}
                            placeholder="Product name"
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Brand</label>

                        <input
                            type="text"
                            name="brand"
                            value={product.brand}
                            onChange={handleInputChange}
                            placeholder="Product brand"
                            required
                            style={styles.input}
                        />
                    </div>
                </div>

                <div style={styles.field}>
                    <label>Description</label>

                    <textarea
                        name="desc"
                        value={product.desc}
                        onChange={handleInputChange}
                        placeholder="Product description"
                        required
                        style={styles.textarea}
                    />
                </div>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label>Price</label>

                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleInputChange}
                            placeholder="Enter price"
                            min="0.01"
                            step="0.01"
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Category</label>

                        <select
                            name="category"
                            value={product.category}
                            onChange={handleInputChange}
                            required
                            style={styles.input}
                        >
                            <option value="">Select Category</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div style={styles.gridThree}>
                    <div style={styles.field}>
                        <label>Stock Quantity</label>

                        <input
                            type="number"
                            name="stockQuantity"
                            value={product.stockQuantity}
                            onChange={handleInputChange}
                            placeholder="Quantity"
                            min="0"
                            step="1"
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Release Date</label>

                        <input
                            type="date"
                            name="releaseDate"
                            value={product.releaseDate}
                            onChange={handleInputChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Replace Product Image</label>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            style={styles.input}
                        />
                    </div>
                </div>

                <div style={styles.field}>
                    <label>
                        {imagePreview
                            ? "New Image Preview"
                            : "Current Product Image"}
                    </label>

                    <img
                        src={
                            imagePreview ||
                            `${API.defaults.baseURL}/products/${id}/image`
                        }
                        alt="Product"
                        style={styles.preview}
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />
                </div>

                <div style={styles.checkbox}>
                    <input
                        type="checkbox"
                        name="available"
                        checked={product.available}
                        onChange={handleInputChange}
                    />

                    <label>Product Available</label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        ...styles.button,
                        opacity: loading ? 0.6 : 1,
                        cursor: loading ? "not-allowed" : "pointer"
                    }}
                >
                    {loading
                        ? "Updating Product..."
                        : "Update Product"}
                </button>

            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "30px auto",
        padding: "25px"
    },

    heading: {
        marginBottom: "25px"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: "20px"
    },

    gridThree: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "15px",
        marginBottom: "20px"
    },

    field: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "20px"
    },

    input: {
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        width: "100%",
        boxSizing: "border-box"
    },

    textarea: {
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        minHeight: "80px",
        resize: "vertical"
    },

    preview: {
        width: "180px",
        height: "180px",
        objectFit: "contain",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginTop: "10px"
    },

    checkbox: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "25px"
    },

    button: {
        padding: "12px 20px",
        backgroundColor: "#198754",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px"
    },

    success: {
        padding: "12px",
        marginBottom: "15px",
        backgroundColor: "#d1e7dd",
        color: "#0f5132",
        borderRadius: "6px"
    },

    error: {
        padding: "12px",
        marginBottom: "15px",
        backgroundColor: "#f8d7da",
        color: "#842029",
        borderRadius: "6px"
    }
};

export default UpdateProduct;