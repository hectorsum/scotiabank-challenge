package com.periferia.solicitudes.exception;

public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException(Long id) {
        super("Solicitud con ID " + id + " no encontrada");
    }

    public EntityNotFoundException(String message) {
        super(message);
    }
}
