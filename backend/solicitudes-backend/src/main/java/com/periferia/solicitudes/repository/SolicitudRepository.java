package com.periferia.solicitudes.repository;

import com.periferia.solicitudes.entity.Solicitud;
import com.periferia.solicitudes.entity.enums.Priority;
import com.periferia.solicitudes.entity.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long>, JpaSpecificationExecutor<Solicitud> {

    List<Solicitud> findByStatus(Status status);

    List<Solicitud> findByTitleContainingIgnoreCase(String title);

    Page<Solicitud> findByStatusAndPriorityOrderByCreationDateDesc(Status status, Priority priority, Pageable pageable);
}
