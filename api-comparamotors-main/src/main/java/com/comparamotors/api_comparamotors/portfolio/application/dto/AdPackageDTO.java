package com.comparamotors.api_comparamotors.portfolio.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AdPackageDTO {
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotNull(message = "El precio total es obligatorio")
    @Positive(message = "El precio total debe ser mayor a 0")
    private BigDecimal totalPrice;

    @NotNull(message = "Debe incluir al menos un espacio publicitario")
    @Size(min = 1, message = "Debe incluir al menos un espacio publicitario")
    private List<Long> adSpaceIds;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}