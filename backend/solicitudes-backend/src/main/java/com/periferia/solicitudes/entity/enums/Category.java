package com.periferia.solicitudes.entity.enums;

import java.util.Arrays;

public enum Category {
    INFRAESTRUCTURA("Infraestructura"),
    SOFTWARE("Software"),
    HARDWARE("Hardware"),
    REDES("Redes"),
    SOPORTE("Soporte Técnico");

    private final String label;

    Category(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static Category fromLabel(String label) {
        return Arrays.stream(values())
                .filter(c -> c.label.equalsIgnoreCase(label) || c.name().equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Categoría inválida: " + label));
    }
}
