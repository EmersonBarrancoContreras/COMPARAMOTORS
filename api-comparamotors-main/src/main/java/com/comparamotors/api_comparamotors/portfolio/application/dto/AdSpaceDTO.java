package com.comparamotors.api_comparamotors.portfolio.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AdSpaceDTO {
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotNull(message = "El costo mensual es obligatorio")
    @Positive(message = "El costo mensual debe ser mayor a 0")
    private BigDecimal monthlyCost;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
