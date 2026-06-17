package com.periferia.solicitudes.repository;

import com.periferia.solicitudes.entity.Solicitud;
import com.periferia.solicitudes.entity.enums.Category;
import com.periferia.solicitudes.entity.enums.Priority;
import com.periferia.solicitudes.entity.enums.Status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@DisplayName("SolicitudRepository - Tests de Integración")
class SolicitudRepositoryTest {

    @Autowired
    private SolicitudRepository repository;

    private Solicitud solicitudPendienteAlta;
    private Solicitud solicitudAprobadaMedia;
    private Solicitud solicitudPendienteBaja;

    @BeforeEach
    void setUp() {
        repository.deleteAll();

        solicitudPendienteAlta = repository.save(Solicitud.builder()
                .title("Actualización de servidor nginx")
                .description("Actualizar nginx por vulnerabilidades")
                .requester("Juan Pérez")
                .category(Category.INFRAESTRUCTURA)
                .priority(Priority.ALTA)
                .status(Status.PENDIENTE)
                .build());

        solicitudAprobadaMedia = repository.save(Solicitud.builder()
                .title("Licencia de software")
                .description("Renovar licencia de JetBrains")
                .requester("María García")
                .category(Category.SOFTWARE)
                .priority(Priority.MEDIA)
                .status(Status.APROBADA)
                .build());

        solicitudPendienteBaja = repository.save(Solicitud.builder()
                .title("Cambio de teclado")
                .description("Teclado con teclas dañadas")
                .requester("Carlos López")
                .category(Category.HARDWARE)
                .priority(Priority.BAJA)
                .status(Status.PENDIENTE)
                .build());
    }

    // findById / save
    @Test
    @DisplayName("Debe guardar solicitud y asignar ID automáticamente")
    void debeGuardarSolicitudYAsignarId() {
        Solicitud nueva = repository.save(Solicitud.builder()
                .title("Nueva solicitud")
                .description("Descripción")
                .requester("Test User")
                .category(Category.REDES)
                .priority(Priority.MEDIA)
                .status(Status.PENDIENTE)
                .build());

        assertNotNull(nueva.getId());
        assertTrue(nueva.getId() > 0);
    }

    @Test
    @DisplayName("Debe encontrar solicitud por ID existente")
    void debeEncontrarSolicitudPorId() {
        Optional<Solicitud> result = repository.findById(solicitudPendienteAlta.getId());

        assertTrue(result.isPresent());
        assertEquals("Actualización de servidor nginx", result.get().getTitle());
        assertEquals(Status.PENDIENTE, result.get().getStatus());
        assertEquals(Priority.ALTA, result.get().getPriority());
    }

    @Test
    @DisplayName("Debe retornar Optional vacío cuando ID no existe")
    void debeRetornarVacioCuandoIdNoExiste() {
        Optional<Solicitud> result = repository.findById(9999L);
        assertFalse(result.isPresent());
    }

    // findByStatus
    @Test
    @DisplayName("Debe encontrar solicitudes por status PENDIENTE")
    void debeEncontrarSolicitudesPorStatusPendiente() {
        List<Solicitud> result = repository.findByStatus(Status.PENDIENTE);

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(s -> s.getStatus() == Status.PENDIENTE));
    }

    @Test
    @DisplayName("Debe encontrar solicitudes por status APROBADA")
    void debeEncontrarSolicitudesPorStatusAprobada() {
        List<Solicitud> result = repository.findByStatus(Status.APROBADA);

        assertEquals(1, result.size());
        assertEquals("Licencia de software", result.get(0).getTitle());
    }

    @Test
    @DisplayName("Debe retornar lista vacía cuando no hay solicitudes con ese status")
    void debeRetornarListaVaciaCuandoNoHaySolicitudesConEseStatus() {
        List<Solicitud> result = repository.findByStatus(Status.RECHAZADA);
        assertTrue(result.isEmpty());
    }

    // findByTitleContainingIgnoreCase
    @Test
    @DisplayName("Debe buscar por título ignorando mayúsculas")
    void debeBuscarPorTituloIgnorandoMayusculas() {
        List<Solicitud> result = repository.findByTitleContainingIgnoreCase("SERVIDOR");

        assertEquals(1, result.size());
        assertEquals("Actualización de servidor nginx", result.get(0).getTitle());
    }

    @Test
    @DisplayName("Debe retornar múltiples resultados con búsqueda parcial")
    void debeRetornarMultiplesResultadosConBusquedaParcial() {
        List<Solicitud> result = repository.findByTitleContainingIgnoreCase("a");

        assertFalse(result.isEmpty());
        assertTrue(result.size() >= 2);
    }

    // findByStatusAndPriorityOrderByCreationDateDesc
    @Test
    @DisplayName("Debe filtrar por status y priority con paginación")
    void debeFiltrarPorStatusYPriorityConPaginacion() {
        Pageable pageable = PageRequest.of(0, 10);

        Page<Solicitud> result = repository.findByStatusAndPriorityOrderByCreationDateDesc(
                Status.PENDIENTE, Priority.ALTA, pageable
        );

        assertEquals(1, result.getTotalElements());
        assertEquals("Actualización de servidor nginx", result.getContent().get(0).getTitle());
    }

    @Test
    @DisplayName("Debe retornar página vacía cuando no hay coincidencias")
    void debeRetornarPaginaVaciaSinCoincidencias() {
        Pageable pageable = PageRequest.of(0, 10);

        Page<Solicitud> result = repository.findByStatusAndPriorityOrderByCreationDateDesc(
                Status.CERRADA, Priority.CRITICA, pageable
        );

        assertEquals(0, result.getTotalElements());
        assertTrue(result.getContent().isEmpty());
    }

    // delete
    @Test
    @DisplayName("Debe eliminar solicitud por ID")
    void debeEliminarSolicitudPorId() {
        Long id = solicitudPendienteAlta.getId();

        repository.deleteById(id);

        assertFalse(repository.findById(id).isPresent());
        assertEquals(2, repository.findAll().size());
    }
}
