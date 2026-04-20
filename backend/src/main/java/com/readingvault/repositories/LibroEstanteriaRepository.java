package com.readingvault.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readingvault.models.LibroEstanteria;

@Repository
public interface LibroEstanteriaRepository extends JpaRepository<LibroEstanteria, Long> {
    
    // Para ver todos los libros que hay dentro de una estantería concreta
    List<LibroEstanteria> findByEstanteriaIdEstanteria(Long idEstanteria);
}