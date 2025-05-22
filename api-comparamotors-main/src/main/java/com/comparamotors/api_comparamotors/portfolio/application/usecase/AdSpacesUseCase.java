package com.comparamotors.api_comparamotors.portfolio.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.comparamotors.api_comparamotors.portfolio.application.dto.AdSpaceDTO;
import com.comparamotors.api_comparamotors.portfolio.application.port.input.AdSpaceService;
import com.comparamotors.api_comparamotors.portfolio.application.port.output.AdSpaceRepository;
import com.comparamotors.api_comparamotors.portfolio.domain.model.AdSpace;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdSpacesUseCase implements AdSpaceService {
    private final AdSpaceRepository adSpaceRepository;

    @Override
    public List<AdSpaceDTO> getAllAdSpaces() {
        return adSpaceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdSpaceDTO getAdSpaceById(Long id) {
        return adSpaceRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("AdSpace not found"));
    }

    @Override
    public AdSpaceDTO createAdSpace(AdSpaceDTO adSpaceDTO) {
        AdSpace adSpace = mapToEntity(adSpaceDTO);
        AdSpace savedAdSpace = adSpaceRepository.save(adSpace);
        return mapToDTO(savedAdSpace);
    }

    @Override
    public AdSpaceDTO updateAdSpace(Long id, AdSpaceDTO adSpaceDTO) {
        AdSpace existingAdSpace = adSpaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AdSpace not found"));
        
        existingAdSpace.setName(adSpaceDTO.getName());
        existingAdSpace.setMonthlyCost(adSpaceDTO.getMonthlyCost());
        
        AdSpace updatedAdSpace = adSpaceRepository.save(existingAdSpace);
        return mapToDTO(updatedAdSpace);
    }

    @Override
    public void deleteAdSpace(Long id) {
        adSpaceRepository.deleteById(id);
    }

    private AdSpaceDTO mapToDTO(AdSpace adSpace) {
        AdSpaceDTO dto = new AdSpaceDTO();
        dto.setId(adSpace.getId());
        dto.setName(adSpace.getName());
        dto.setMonthlyCost(adSpace.getMonthlyCost());
        return dto;
    }

    private AdSpace mapToEntity(AdSpaceDTO dto) {
        AdSpace adSpace = new AdSpace();
        adSpace.setId(dto.getId());
        adSpace.setName(dto.getName());
        adSpace.setMonthlyCost(dto.getMonthlyCost());
        return adSpace;
    }
}
