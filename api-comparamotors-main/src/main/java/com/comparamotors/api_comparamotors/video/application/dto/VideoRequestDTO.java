package com.comparamotors.api_comparamotors.video.application.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class VideoRequestDTO {
    private final String channelId;

    @JsonCreator
    public VideoRequestDTO(@JsonProperty("channelId") String channelId) {
        this.channelId = channelId;
    }

    public String getChannelId() {
        return channelId;
    }
}
