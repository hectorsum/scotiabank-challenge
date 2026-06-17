package com.periferia.solicitudes.exception;

public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException(Long id) {
        super("Solicitud con ID " + id + " no encontrada");
    }

    public EntityNotFoundException(String message) {
        super(message);
    }

    public EntityNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public static EntityNotFoundException solicitudNotFound(Long id) {
        return new EntityNotFoundException("Solicitud con ID " + id + " no encontrada");
    }
}
