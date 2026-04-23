// Repositorio para la tabla 'libro'
package com.readingvault.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readingvault.models.Libro;

@Repository
public interface LibroRepository extends JpaRepository<Libro, Long> {

    // Para el buscador: busca libros que contengan el texto (sin importar mayúsculas)
    List<Libro> findByTituloContainingIgnoreCase(String titulo);
    Optional<Libro> findByTituloAndAutor(String titulo, String autor);
}
