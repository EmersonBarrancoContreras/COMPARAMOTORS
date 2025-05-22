package com.comparamotors.api_comparamotors.portfolio.application.port.input;

import java.util.List;

import com.comparamotors.api_comparamotors.portfolio.application.dto.AdPackageDTO;

public interface AdPackageService {
    List<AdPackageDTO> getAllAdPackages();
    AdPackageDTO getAdPackageById(Long id);
    AdPackageDTO createAdPackage(AdPackageDTO adPackageDTO);
    AdPackageDTO updateAdPackage(Long id, AdPackageDTO adPackageDTO);
    void deleteAdPackage(Long id);
}
