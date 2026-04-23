package com.readingvault.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readingvault.models.RetoLectura;

@Repository
public interface RetoLecturaRepository extends JpaRepository<RetoLectura, Long> {
    Optional<RetoLectura> findByUsuario_IdUsuarioAndYear(Long idUsuario, int year);
}
