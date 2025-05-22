package com.comparamotors.api_comparamotors.portfolio.application.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AdSalesDTO {
    private Long id;

    @NotNull(message = "El ID de usuario es obligatorio")
    private Long userId;

    private Long adSpaceId;
    private Long adPackageId;

    @NotNull(message = "La duración en meses es obligatoria")
    @Positive(message = "La duración debe ser mayor a 0")
    private Integer durationMonths;

    @NotNull(message = "El precio total es obligatorio")
    @Positive(message = "El precio total debe ser mayor a 0")
    private BigDecimal totalPrice;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @FutureOrPresent(message = "La fecha de inicio debe ser presente o futura")
    private LocalDate startDate;

    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDate endDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}