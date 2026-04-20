package com.readingvault.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readingvault.models.MensajeComunidad;

@Repository
public interface MensajeComunidadRepository extends JpaRepository<MensajeComunidad, Long> {
    // Permite obtener el historial de mensajes de un foro específico
    List<MensajeComunidad> findByComunidadIdComunidad(Long idComunidad);
}