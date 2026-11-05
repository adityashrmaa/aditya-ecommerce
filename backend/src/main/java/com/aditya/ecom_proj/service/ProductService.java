
package com.aditya.ecom_proj.service;

import com.aditya.ecom_proj.model.Product;
import com.aditya.ecom_proj.repository.ProductRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepo repo;

    public ProductService(ProductRepo repo) {
        this.repo = repo;
    }

    // Get all products
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    // Get product by ID
    public Optional<Product> getProductById(Integer id) {
        return repo.findById(id);
    }

    // Add product with image stored in MySQL
    public Product addProduct(Product product, MultipartFile imageFile)
            throws IOException {

        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("Product image is required");
        }

        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageData(imageFile.getBytes());

        return repo.save(product);
    }

    public Product updateProduct(
            Integer id,
            Product updatedProduct,
            MultipartFile imageFile
    ) throws IOException {

        Product existingProduct = repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found with id: " + id)
                );

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDesc(updatedProduct.getDesc());
        existingProduct.setBrand(updatedProduct.getBrand());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setReleaseDate(updatedProduct.getReleaseDate());
        existingProduct.setAvailable(updatedProduct.isAvailable());
        existingProduct.setStockQuantity(updatedProduct.getStockQuantity());

        // Replace image only if a new image is uploaded
        if (imageFile != null && !imageFile.isEmpty()) {
            existingProduct.setImageName(imageFile.getOriginalFilename());
            existingProduct.setImageType(imageFile.getContentType());
            existingProduct.setImageData(imageFile.getBytes());
        }

        return repo.save(existingProduct);
    }

    public void deleteProduct(Integer id) {
        Product product = repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found with id: " + id)
                );

        repo.delete(product);
    }
}
