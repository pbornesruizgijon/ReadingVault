package com.readingvault.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readingvault.models.Libro;
import com.readingvault.models.Noticia;
import com.readingvault.repositories.LibroRepository;
import com.readingvault.repositories.NoticiaRepository;

@RestController
@RequestMapping("/api/noticias")
@CrossOrigin(origins = "http://localhost:5173")
public class NoticiaController {

    @Autowired
    private NoticiaRepository noticiaRepository;

    @Autowired
    private LibroRepository libroRepository;

    @GetMapping
    public ResponseEntity<List<Noticia>> listarNoticias() {
        List<Noticia> noticias = noticiaRepository.findAllByOrderByIdNoticiaDesc();
        return ResponseEntity.ok(noticias);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Noticia> crearNoticia(@RequestBody Noticia noticia) {
        // Asignamos la fecha actual de forma automática
        noticia.setFecha(LocalDate.now().toString());

        // Comprobamos si viene un libro asociado en la petición
        if (noticia.getLibro() != null) {
            Libro libroNoticia = noticia.getLibro();

            // Solo guardamos si tiene un ISBN informado
            if (libroNoticia.getIsbn() != null && !libroNoticia.getIsbn().trim().isEmpty()) {
                Optional<Libro> existe = Optional.empty();

                // Buscamos primero por el ISBN que es nuestro campo único más seguro
                existe = libroRepository.findByIsbn(libroNoticia.getIsbn().trim());

                // Si por un casual no lo encuentra, hacemos la doble comprobación por título y autor
                if (existe.isEmpty() && libroNoticia.getTitulo() != null && libroNoticia.getAutor() != null) {
                    existe = libroRepository.findByTituloAndAutor(libroNoticia.getTitulo(), libroNoticia.getAutor());
                }

                if (existe.isPresent()) {
                    // Si el libro ya existía en local, vinculamos ese ID existente a la noticia
                    noticia.setLibro(existe.get());
                } else {
                    // Si el libro tiene ISBN pero es nuevo, lo guardamos limpio en la BBDD
                    Libro libroGuardado = libroRepository.save(libroNoticia);
                    noticia.setLibro(libroGuardado);
                }
            } else {
                // Si el admin seleccionó un libro pero no tiene ISBN, lo forzamos a null
                // Así la noticia se publica de forma segura como una noticia de texto común
                noticia.setLibro(null);
            }
        }

        // Guardamos la noticia final de forma totalmente segura
        Noticia nuevaNoticia = noticiaRepository.save(noticia);
        return ResponseEntity.ok(nuevaNoticia);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarNoticia(@PathVariable Long id) {
        // Comprobamos si la noticia existe en la base de datos antes de borrar
        return noticiaRepository.findById(id)
                .map(noticia -> {
                    noticiaRepository.delete(noticia);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Noticia> editarNoticia(@PathVariable Long id, @RequestBody Noticia datosActualizados) {
        return noticiaRepository.findById(id)
                .map(noticia -> {
                    // Actualizamos únicamente los campos editables del artículo
                    noticia.setTitulo(datosActualizados.getTitulo());
                    noticia.setContenido(datosActualizados.getContenido());
                    
                    Noticia guardada = noticiaRepository.save(noticia);
                    return ResponseEntity.ok(guardada);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}