package com.readingvault.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readingvault.models.Noticia;

@Repository
public interface NoticiaRepository extends JpaRepository<Noticia, Long> {
    // Devuelve las noticias ordenadas de más reciente a más antigua
    List<Noticia> findAllByOrderByIdNoticiaDesc();
}