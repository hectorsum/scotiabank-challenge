package com.periferia.solicitudes.entity.enums;

import java.util.Arrays;

public enum Status {
    PENDIENTE("pendiente"),
    EN_REVISION("en revisión"),
    APROBADA("aprobada"),
    RECHAZADA("rechazada"),
    CERRADA("cerrada");

    private final String label;

    Status(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static Status fromLabel(String label) {
        return Arrays.stream(values())
                .filter(s -> s.label.equalsIgnoreCase(label) || s.name().equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Estado inválido: " + label));
    }
}
