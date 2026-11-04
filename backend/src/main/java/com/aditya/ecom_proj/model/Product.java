
package com.aditya.ecom_proj.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @Column(name = "description")
    private String desc;

    private String brand;

    private BigDecimal price;

    private String category;

    private LocalDate releaseDate;

    private boolean available;

    @Column(name = "quantity")
    private Integer stockQuantity = 0;

    private String imageName;

    private String imageType;

    @Lob
    @JsonIgnore
    @ToString.Exclude
    @Column(name = "image_data", columnDefinition = "MEDIUMBLOB")
    private byte[] imageData;
}
