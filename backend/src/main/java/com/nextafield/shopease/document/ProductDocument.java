package com.nextafield.shopease.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;
import lombok.*;
import java.math.BigDecimal;

@Document(indexName = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Setting(settingPath = "elasticsearch/settings.json")
public class ProductDocument {

    @Id
    private String id;

    @Field(type = FieldType.Search_As_You_Type)
    private String title;

    @Field(type = FieldType.Text)
    private String description;

    @Field(type = FieldType.Keyword)
    private String brand;

    @Field(type = FieldType.Double)
    private BigDecimal price;

    @Field(type = FieldType.Keyword)
    private String currency;

    @Field(type = FieldType.Long)
    private Long categoryId;

    @Field(type = FieldType.Keyword)
    private String categoryName;

    @Field(type = FieldType.Integer)
    private Integer stockQuantity;
}