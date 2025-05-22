package com.comparamotors.api_comparamotors.advertisement.application.port.input;

import java.util.List;

import com.comparamotors.api_comparamotors.advertisement.application.dto.AdvertisementRequestDTO;
import com.comparamotors.api_comparamotors.advertisement.application.dto.AdvertisementResponseDTO;

public interface AdvertisementService {
    AdvertisementResponseDTO createAdvertisement(AdvertisementRequestDTO advertisementRequest);
    AdvertisementResponseDTO updateAdvertisement(Long id,AdvertisementRequestDTO advertisementRequest);
    void deleteAdvertisement(Long id);
    AdvertisementResponseDTO getAdvertisementById(Long id);
    List<AdvertisementResponseDTO> getAllAdvertisements();
}