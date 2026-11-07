package com.aditya.ecom_proj.service;

import com.aditya.ecom_proj.model.Product;
import com.aditya.ecom_proj.repository.ProductRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepo repo;

    @InjectMocks
    private ProductService service;

    @Test
    void shouldReturnAllProducts() {
        List<Product> products = List.of(new Product(), new Product());

        when(repo.findAll()).thenReturn(products);

        List<Product> result = service.getAllProducts();

        assertEquals(2, result.size());
        verify(repo).findAll();
    }

    @Test
    void shouldReturnProductById() {
        Product product = new Product();

        when(repo.findById(1)).thenReturn(Optional.of(product));

        Optional<Product> result = service.getProductById(1);

        assertTrue(result.isPresent());
        assertSame(product, result.get());
        verify(repo).findById(1);
    }

    @Test
    void shouldDeleteExistingProduct() {
        Product product = new Product();

        when(repo.findById(1)).thenReturn(Optional.of(product));

        service.deleteProduct(1);

        verify(repo).delete(product);
    }

    @Test
    void shouldThrowExceptionWhenDeletingMissingProduct() {
        when(repo.findById(99)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.deleteProduct(99)
        );

        assertEquals("Product not found with id: 99", exception.getMessage());
        verify(repo, never()).delete(any(Product.class));
    }

    @Test
    void shouldAddProductWithImage() throws Exception {
        Product product = new Product();
        MultipartFile image = mock(MultipartFile.class);
        byte[] imageData = {1, 2, 3};

        when(image.isEmpty()).thenReturn(false);
        when(image.getOriginalFilename()).thenReturn("phone.jpg");
        when(image.getContentType()).thenReturn("image/jpeg");
        when(image.getBytes()).thenReturn(imageData);
        when(repo.save(product)).thenReturn(product);

        Product result = service.addProduct(product, image);

        assertSame(product, result);
        assertEquals("phone.jpg", product.getImageName());
        assertEquals("image/jpeg", product.getImageType());
        assertArrayEquals(imageData, product.getImageData());
        verify(repo).save(product);
    }

    @Test
    void shouldRejectProductWithoutImage() {
        Product product = new Product();

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addProduct(product, null)
        );

        assertEquals("Product image is required", exception.getMessage());
        verify(repo, never()).save(any(Product.class));
    }

    @Test
    void shouldUpdateProductAndPreserveExistingImage() throws Exception {
        Product existing = new Product();
        existing.setName("Old Name");
        existing.setImageName("old.jpg");
        existing.setImageType("image/jpeg");
        existing.setImageData(new byte[]{1, 2, 3});

        Product updated = new Product();
        updated.setName("Updated Name");

        when(repo.findById(1)).thenReturn(Optional.of(existing));
        when(repo.save(existing)).thenReturn(existing);

        Product result = service.updateProduct(1, updated, null);

        assertSame(existing, result);
        assertEquals("Updated Name", result.getName());
        assertEquals("old.jpg", result.getImageName());
        assertArrayEquals(new byte[]{1, 2, 3}, result.getImageData());
        verify(repo).save(existing);
    }

    @Test
    void shouldReplaceExistingImageDuringUpdate() throws Exception {
        Product existing = new Product();
        existing.setImageData(new byte[]{1, 2, 3});

        Product updated = new Product();
        MultipartFile image = mock(MultipartFile.class);
        byte[] newImageData = {4, 5, 6};

        when(repo.findById(1)).thenReturn(Optional.of(existing));
        when(image.isEmpty()).thenReturn(false);
        when(image.getOriginalFilename()).thenReturn("new.jpg");
        when(image.getContentType()).thenReturn("image/png");
        when(image.getBytes()).thenReturn(newImageData);
        when(repo.save(existing)).thenReturn(existing);

        Product result = service.updateProduct(1, updated, image);

        assertEquals("new.jpg", result.getImageName());
        assertEquals("image/png", result.getImageType());
        assertArrayEquals(newImageData, result.getImageData());
        verify(repo).save(existing);
    }
}
