package com.comparamotors.api_comparamotors.portfolio.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.comparamotors.api_comparamotors.portfolio.application.dto.AdSalesDTO;
import com.comparamotors.api_comparamotors.portfolio.application.port.input.AdSalesService;
import com.comparamotors.api_comparamotors.portfolio.application.port.output.AdPackageRepository;
import com.comparamotors.api_comparamotors.portfolio.application.port.output.AdSalesRepository;
import com.comparamotors.api_comparamotors.portfolio.application.port.output.AdSpaceRepository;
import com.comparamotors.api_comparamotors.portfolio.domain.exception.BusinessException;
import com.comparamotors.api_comparamotors.portfolio.domain.model.AdPackage;
import com.comparamotors.api_comparamotors.portfolio.domain.model.AdSales;
import com.comparamotors.api_comparamotors.portfolio.domain.model.AdSpace;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdSalesUseCase implements AdSalesService {
    private final AdSalesRepository adSalesRepository;
    private final AdSpaceRepository adSpaceRepository;
    private final AdPackageRepository adPackageRepository;

    @Override
    public List<AdSalesDTO> getAllAdSales() {
        return adSalesRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdSalesDTO getAdSaleById(Long id) {
        return adSalesRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("AdSale not found"));
    }

    @Override
    @Transactional
    public AdSalesDTO createAdSale(AdSalesDTO adSalesDTO) {
        // Validar que se especifica o un espacio o un paquete, pero no ambos
        if ((adSalesDTO.getAdSpaceId() == null && adSalesDTO.getAdPackageId() == null) ||
                (adSalesDTO.getAdSpaceId() != null && adSalesDTO.getAdPackageId() != null)) {
            throw new BusinessException("Debe especificar un espacio publicitario o un paquete, pero no ambos");
        }

        // Validar fechas
        if (adSalesDTO.getEndDate().isBefore(adSalesDTO.getStartDate())) {
            throw new BusinessException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }

        // Validar duración
        long monthsBetween = ChronoUnit.MONTHS.between(
                adSalesDTO.getStartDate(),
                adSalesDTO.getEndDate());
        if (monthsBetween != adSalesDTO.getDurationMonths()) {
            throw new BusinessException("La duración en meses no coincide con las fechas especificadas");
        }

        AdSales adSales = new AdSales();
        adSales.setUserId(adSalesDTO.getUserId());
        adSales.setDurationMonths(adSalesDTO.getDurationMonths());
        adSales.setTotalPrice(adSalesDTO.getTotalPrice());
        adSales.setStartDate(adSalesDTO.getStartDate());
        adSales.setEndDate(adSalesDTO.getEndDate());

        // Validar y establecer espacio o paquete
        if (adSalesDTO.getAdSpaceId() != null) {
            AdSpace adSpace = adSpaceRepository.findById(adSalesDTO.getAdSpaceId())
                    .orElseThrow(() -> new BusinessException("Espacio publicitario no encontrado"));
            adSales.setAdSpace(adSpace);

            // Validar precio para espacio individual
            BigDecimal expectedPrice = adSpace.getMonthlyCost()
                    .multiply(BigDecimal.valueOf(adSalesDTO.getDurationMonths()));
            if (adSalesDTO.getTotalPrice().compareTo(expectedPrice) != 0) {
                throw new BusinessException("El precio total no coincide con el costo mensual por la duración");
            }
        } else {
            AdPackage adPackage = adPackageRepository.findById(adSalesDTO.getAdPackageId())
                    .orElseThrow(() -> new BusinessException("Paquete publicitario no encontrado"));
            adSales.setAdPackage(adPackage);

            // Validar precio para paquete
            BigDecimal expectedPrice = adPackage.getTotalPrice()
                    .multiply(BigDecimal.valueOf(adSalesDTO.getDurationMonths()));
            if (adSalesDTO.getTotalPrice().compareTo(expectedPrice) != 0) {
                throw new BusinessException("El precio total no coincide con el precio del paquete por la duración");
            }
        }

        AdSales savedSale = adSalesRepository.save(adSales);
        return mapToDTO(savedSale);
    }

    @Override
    @Transactional
    public AdSalesDTO updateAdSale(Long id, AdSalesDTO adSalesDTO) {
        AdSales existingSale = adSalesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AdSale not found"));

        existingSale.setUserId(adSalesDTO.getUserId());
        existingSale.setDurationMonths(adSalesDTO.getDurationMonths());
        existingSale.setTotalPrice(adSalesDTO.getTotalPrice());
        existingSale.setStartDate(adSalesDTO.getStartDate());
        existingSale.setEndDate(adSalesDTO.getEndDate());

        if (adSalesDTO.getAdSpaceId() != null) {
            existingSale.setAdSpace(adSpaceRepository.findById(adSalesDTO.getAdSpaceId())
                    .orElseThrow(() -> new RuntimeException("AdSpace not found")));
        }

        if (adSalesDTO.getAdPackageId() != null) {
            existingSale.setAdPackage(adPackageRepository.findById(adSalesDTO.getAdPackageId())
                    .orElseThrow(() -> new RuntimeException("AdPackage not found")));
        }

        AdSales updatedSale = adSalesRepository.save(existingSale);
        return mapToDTO(updatedSale);
    }

    @Override
    public void deleteAdSale(Long id) {
        adSalesRepository.deleteById(id);
    }

    @Override
    public List<AdSalesDTO> getAdSalesByUserId(Long userId) {
        return adSalesRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AdSalesDTO mapToDTO(AdSales adSales) {
        AdSalesDTO dto = new AdSalesDTO();
        dto.setId(adSales.getId());
        dto.setUserId(adSales.getUserId());
        dto.setDurationMonths(adSales.getDurationMonths());
        dto.setTotalPrice(adSales.getTotalPrice());
        dto.setStartDate(adSales.getStartDate());
        dto.setEndDate(adSales.getEndDate());

        if (adSales.getAdSpace() != null) {
            dto.setAdSpaceId(adSales.getAdSpace().getId());
        }

        if (adSales.getAdPackage() != null) {
            dto.setAdPackageId(adSales.getAdPackage().getId());
        }

        return dto;
    }
}
