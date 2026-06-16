package com.periferia.solicitudes.entity.enums;

import java.util.Arrays;

public enum Priority {
    BAJA("baja"),
    MEDIA("media"),
    ALTA("alta"),
    CRITICA("crítica");

    private final String label;

    Priority(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static Priority fromLabel(String label) {
        return Arrays.stream(values())
                .filter(p -> p.label.equalsIgnoreCase(label) || p.name().equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Prioridad inválida: " + label));
    }
}
