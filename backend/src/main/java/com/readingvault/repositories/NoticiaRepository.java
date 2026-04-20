package com.readingvault.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readingvault.models.Noticia;

@Repository
public interface NoticiaRepository extends JpaRepository<Noticia, Long> {
    // Gestiona id_noticia, título, contenido y fecha
}