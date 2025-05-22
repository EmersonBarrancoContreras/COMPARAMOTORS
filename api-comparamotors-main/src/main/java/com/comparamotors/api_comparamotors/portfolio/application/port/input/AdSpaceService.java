package com.comparamotors.api_comparamotors.portfolio.application.port.input;

import java.util.List;

import com.comparamotors.api_comparamotors.portfolio.application.dto.AdSpaceDTO;

public interface AdSpaceService {
    List<AdSpaceDTO> getAllAdSpaces();
    AdSpaceDTO getAdSpaceById(Long id);
    AdSpaceDTO createAdSpace(AdSpaceDTO adSpaceDTO);
    AdSpaceDTO updateAdSpace(Long id, AdSpaceDTO adSpaceDTO);
    void deleteAdSpace(Long id);
}