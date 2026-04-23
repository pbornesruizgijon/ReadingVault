package com.readingvault.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readingvault.models.Estanteria;
import com.readingvault.models.Libro;
import com.readingvault.models.LibroEstanteria;

@Repository
public interface LibroEstanteriaRepository extends JpaRepository<LibroEstanteria, Long> {
    
    // Para ver todos los libros que hay dentro de una estantería concreta
    List<LibroEstanteria> findByEstanteriaIdEstanteria(Long idEstanteria);

    // Para saber si un libro ya está en una estantería específica
    boolean existsByEstanteriaAndLibro(Estanteria estanteria, Libro libro);

    // Para el reto de lectura por año 
    long countByEstanteriaAndFechaAgregadoBetween(Estanteria estanteria, LocalDate inicio, LocalDate fin);
}