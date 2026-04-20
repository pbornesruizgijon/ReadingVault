package com.readingvault.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readingvault.models.UsuarioComunidad;

@Repository
public interface UsuarioComunidadRepository extends JpaRepository<UsuarioComunidad, Long> {
    // Gestiona la relación entre usuarios y sus comunidades
}