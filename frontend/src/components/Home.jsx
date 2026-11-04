
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";

const IMAGE_BASE_URL = "http://localhost:8080/api/products";

const Home = ({ selectedCategory }) => {
    const { data, isError, addToCart, refreshData } =
        useContext(AppContext);

    useEffect(() => {
    refreshData();
}, []);

    if (isError) {
        return (
            <h2 className="text-center" style={{ padding: "10rem" }}>
                Something went wrong...
            </h2>
        );
    }

    const products = data || [];

    const filteredProducts = selectedCategory
        ? products.filter(
            (product) => product.category === selectedCategory
        )
        : products;

    if (filteredProducts.length === 0) {
        return (
            <h2
                className="text-center"
                style={{
                    padding: "5rem",
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                No Products Available
            </h2>
        );
    }

    return (
        <div className="grid">
            {filteredProducts.map((product) => {
                const {
                    id,
                    brand,
                    name,
                    price,
                    available,
                    imageName
                } = product;

                const imageUrl = imageName
                    ? `${IMAGE_BASE_URL}/${id}/image`
                    : null;

                return (
                    <div
                        className="card mb-3"
                        key={id}
                        style={{
                            width: "18rem",
                            height: "24rem",
                            boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 3px",
                            backgroundColor: available ? "#fff" : "#ccc",
                            margin: "10px",
                            display: "flex",
                            flexDirection: "column",
                            position: "relative"
                        }}
                    >
                        <Link
                            to={`/product/${id}`}
                            style={{
                                textDecoration: "none",
                                color: "inherit"
                            }}
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={name}
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                    style={{
                                        width: "100%",
                                        height: "180px",
                                        objectFit: "contain",
                                        padding: "5px",
                                        margin: "0"
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        height: "180px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "#777"
                                    }}
                                >
                                    No Image Available
                                </div>
                            )}

                            <div
                                className="buttons"
                                style={{
                                    position: "absolute",
                                    top: "15px",
                                    right: "15px",
                                    zIndex: 1
                                }}
                            >
                                <div className="buttons-liked">
                                    <i className="bi bi-heart"></i>
                                </div>
                            </div>

                            <div
                                className="card-body"
                                style={{
                                    flexGrow: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    padding: "10px"
                                }}
                            >
                                <div>
                                    <h5
                                        className="card-title"
                                        style={{ margin: "0 0 10px 0" }}
                                    >
                                        {name?.toUpperCase()}
                                    </h5>

                                    <i
                                        className="card-brand"
                                        style={{ fontStyle: "italic" }}
                                    >
                                        {"~ " + brand}
                                    </i>
                                </div>

                                <div>
                                    <h5
                                        className="card-text"
                                        style={{
                                            fontWeight: "600",
                                            margin: "5px 0"
                                        }}
                                    >
                                        {"$" + price}
                                    </h5>

                                    <button
                                        className="btn btn-primary"
                                        style={{ width: "100%" }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            addToCart(product);
                                        }}
                                        disabled={!available}
                                    >
                                        {available
                                            ? "Add to Cart"
                                            : "Out of Stock"}
                                    </button>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default Home;
