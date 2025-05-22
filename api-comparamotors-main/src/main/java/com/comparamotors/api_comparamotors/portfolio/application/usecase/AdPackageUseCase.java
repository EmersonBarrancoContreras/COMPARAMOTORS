package com.comparamotors.api_comparamotors.portfolio.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.comparamotors.api_comparamotors.portfolio.application.dto.AdPackageDTO;
import com.comparamotors.api_comparamotors.portfolio.application.port.input.AdPackageService;
import com.comparamotors.api_comparamotors.portfolio.application.port.output.AdPackageRepository;
import com.comparamotors.api_comparamotors.portfolio.application.port.output.AdSpaceRepository;
import com.comparamotors.api_comparamotors.portfolio.domain.exception.BusinessException;
import com.comparamotors.api_comparamotors.portfolio.domain.model.AdPackage;
import com.comparamotors.api_comparamotors.portfolio.domain.model.AdSpace;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdPackageUseCase implements AdPackageService {
    private final AdPackageRepository adPackageRepository;
    private final AdSpaceRepository adSpaceRepository;

    @Override
    public List<AdPackageDTO> getAllAdPackages() {
        return adPackageRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdPackageDTO getAdPackageById(Long id) {
        return adPackageRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("AdPackage not found"));
    }

    @Override
    @Transactional
    public AdPackageDTO createAdPackage(AdPackageDTO adPackageDTO) {
        // Validar que al menos uno de los espacios publicitarios existe
        if (adPackageDTO.getAdSpaceIds().isEmpty()) {
            throw new BusinessException("Debe incluir al menos un espacio publicitario");
        }

        // Validar que todos los espacios publicitarios existen
        List<AdSpace> adSpaces = adPackageDTO.getAdSpaceIds().stream()
                .map(id -> adSpaceRepository.findById(id)
                        .orElseThrow(() -> new BusinessException("Espacio publicitario no encontrado: " + id)))
                .collect(Collectors.toList());

        // Validar que el precio total es coherente con los espacios incluidos
        BigDecimal totalMonthlyCost = adSpaces.stream()
                .map(AdSpace::getMonthlyCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (adPackageDTO.getTotalPrice().compareTo(totalMonthlyCost) > 0) {
            throw new BusinessException(
                    "El precio total del paquete no puede ser mayor que la suma de los costos mensuales");
        }

        AdPackage adPackage = new AdPackage();
        adPackage.setName(adPackageDTO.getName());
        adPackage.setTotalPrice(adPackageDTO.getTotalPrice());
        adPackage.setAdSpaces(adSpaces);

        AdPackage savedPackage = adPackageRepository.save(adPackage);
        return mapToDTO(savedPackage);
    }

    @Override
    @Transactional
    public AdPackageDTO updateAdPackage(Long id, AdPackageDTO adPackageDTO) {
        AdPackage existingPackage = adPackageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AdPackage not found"));

        List<AdSpace> adSpaces = adPackageDTO.getAdSpaceIds().stream()
                .map(spaceId -> adSpaceRepository.findById(spaceId)
                        .orElseThrow(() -> new RuntimeException("AdSpace not found: " + spaceId)))
                .collect(Collectors.toList());

        existingPackage.setName(adPackageDTO.getName());
        existingPackage.setTotalPrice(adPackageDTO.getTotalPrice());
        existingPackage.setAdSpaces(adSpaces);

        AdPackage updatedPackage = adPackageRepository.save(existingPackage);
        return mapToDTO(updatedPackage);
    }

    @Override
    public void deleteAdPackage(Long id) {
        adPackageRepository.deleteById(id);
    }

    private AdPackageDTO mapToDTO(AdPackage adPackage) {
        AdPackageDTO dto = new AdPackageDTO();
        dto.setId(adPackage.getId());
        dto.setName(adPackage.getName());
        dto.setTotalPrice(adPackage.getTotalPrice());
        dto.setAdSpaceIds(adPackage.getAdSpaces().stream()
                .map(AdSpace::getId)
                .collect(Collectors.toList()));
        return dto;
    }
}
