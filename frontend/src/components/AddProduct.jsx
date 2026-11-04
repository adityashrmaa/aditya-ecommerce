
import React, { useState, useEffect } from "react";
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

const AddProduct = () => {
    const [product, setProduct] = useState(initialProduct);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setProduct((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

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

    const submitHandler = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (loading) return;

        // Validate form
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

        if (!image) {
            setError("Please select a product image.");
            return;
        }

        // Match Product.java:
        // @JsonProperty("stockQuantity")
        // private int quantity;
        const productData = {
            name: product.name.trim(),
            brand: product.brand.trim(),
            desc: product.desc.trim(),
            price: price,
            category: product.category,
            stockQuantity: stockQuantity,
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

        formData.append("imageFile", image);

        try {
            setLoading(true);

            console.log("Sending product data:", productData);

            const response = await API.post(
                "/products",
                formData
            );

            console.log("Product added:", response.data);

            setMessage("Product added successfully!");

            setProduct({ ...initialProduct });
            setImage(null);
            setImagePreview(null);

            e.target.reset();

        } catch (error) {
            console.error("Add Product Error:", error);

            const responseData = error.response?.data;

            let errorMessage =
                "Something went wrong while adding the product.";

            if (typeof responseData === "string") {
                errorMessage = responseData;
            } else if (responseData?.message) {
                errorMessage = responseData.message;
            } else if (responseData) {
                errorMessage = JSON.stringify(responseData);
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
            alert("Product Error: " + errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Add Product</h2>

            {message && (
                <div style={styles.success}>{message}</div>
            )}

            {error && (
                <div style={styles.error}>{error}</div>
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
                        <label>Product Image</label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            style={styles.input}
                        />
                    </div>
                </div>

                {imagePreview && (
                    <div style={styles.field}>
                        <label>Image Preview</label>
                        <img
                            src={imagePreview}
                            alt="Product Preview"
                            style={styles.preview}
                        />
                    </div>
                )}

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
                    {loading ? "Adding Product..." : "Add Product"}
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
        backgroundColor: "#0d6efd",
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

export default AddProduct;
