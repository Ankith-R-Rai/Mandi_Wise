package com.mandiwise.quality.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Collections;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SupportedCropsResponseDto {

    @JsonProperty("supported_vegetables")
    private List<SupportedCropDto> supportedVegetables = Collections.emptyList();

    private int count;

    public SupportedCropsResponseDto() {}

    public List<SupportedCropDto> getSupportedVegetables() {
        return supportedVegetables;
    }

    public void setSupportedVegetables(List<SupportedCropDto> supportedVegetables) {
        this.supportedVegetables = supportedVegetables != null ? supportedVegetables : Collections.emptyList();
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SupportedCropDto {
        private String name;

        @JsonProperty("agmarknet_aliases")
        private List<String> agmarknetAliases = Collections.emptyList();

        @JsonProperty("agmark_visual_note")
        private String agmarkVisualNote;

        public SupportedCropDto() {}

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<String> getAgmarknetAliases() {
            return agmarknetAliases;
        }

        public void setAgmarknetAliases(List<String> agmarknetAliases) {
            this.agmarknetAliases = agmarknetAliases != null ? agmarknetAliases : Collections.emptyList();
        }

        public String getAgmarkVisualNote() {
            return agmarkVisualNote;
        }

        public void setAgmarkVisualNote(String agmarkVisualNote) {
            this.agmarkVisualNote = agmarkVisualNote;
        }
    }
}
