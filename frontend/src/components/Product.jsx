
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import API from "../axios";

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { addToCart } = useContext(AppContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setImageError(false);

                const response = await API.get(`/products/${id}`);
                setProduct(response.data);

            } catch (error) {
                console.error("Error fetching product:", error);
                setProduct(null);

            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        alert("Product added to cart");
    };

    // Delete product
    const handleDeleteProduct = async () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmDelete || deleting) return;

        try {
            setDeleting(true);

            await API.delete(`/products/${id}`);

            alert("Product deleted successfully!");

            navigate("/");

        } catch (error) {
            console.error("Delete Product Error:", error);

            alert(
                error.response?.data?.message ||
                "Something went wrong while deleting the product."
            );

        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <h2 className="text-center" style={{ padding: "10rem" }}>
                Loading...
            </h2>
        );
    }

    if (!product) {
        return (
            <h2 className="text-center" style={{ padding: "10rem" }}>
                Product not found!
            </h2>
        );
    }

    const imageUrl = `${API.defaults.baseURL}/products/${id}/image`;

    return (
        <div className="containers">

            {!imageError ? (
                <img
                    className="left-column-img"
                    src={imageUrl}
                    alt={product.name}
                    onError={() => {
                        console.error("Product image failed:", imageUrl);
                        setImageError(true);
                    }}
                    style={{
                        display: "block",
                        width: "100%",
                        maxWidth: "500px",
                        height: "450px",
                        objectFit: "contain"
                    }}
                />
            ) : (
                <div
                    className="left-column-img"
                    style={{
                        width: "100%",
                        maxWidth: "500px",
                        height: "450px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #ddd"
                    }}
                >
                    Image could not be loaded
                </div>
            )}

            <div className="right-column">

                <div className="product-description">
                    <span>{product.category}</span>
                    <h1>{product.name}</h1>
                    <h5>{product.brand}</h5>
                    <p>{product.desc}</p>
                </div>

                <div className="product-price">

                    <span>{"$" + product.price}</span>

                    <button
                        className={`cart-btn ${
                            !product.available ? "disabled-btn" : ""
                        }`}
                        onClick={handleAddToCart}
                        disabled={!product.available}
                    >
                        {product.available ? "Add to cart" : "Out of Stock"}
                    </button>

                    {/* Edit Product Button */}
                    <button
                        className="btn btn-warning mt-2"
                        onClick={() => navigate(`/update-product/${id}`)}
                    >
                        Edit Product
                    </button>

                    {/* Delete Product Button */}
                    <button
                        className="btn btn-danger mt-2 ms-2"
                        onClick={handleDeleteProduct}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete Product"}
                    </button>

                    <h6>
                        Stock Available:{" "}
                        <i style={{ color: "green", fontWeight: "bold" }}>
                            {product.stockQuantity}
                        </i>
                    </h6>

                    <div className="release-date">
                        <h6>Product listed on:</h6>
                        <i>{product.releaseDate}</i>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Product;
