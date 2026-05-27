package com.readingvault.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readingvault.models.Libro;
import com.readingvault.models.Review;
import com.readingvault.models.Usuario;
import com.readingvault.repositories.LibroRepository;
import com.readingvault.repositories.ReviewRepository;
import com.readingvault.repositories.UsuarioRepository;
import com.readingvault.services.AmistadService;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private LibroRepository libroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AmistadService amistadService;

    @PostMapping("/votar")
    public ResponseEntity<?> registrarVoto(@RequestBody Map<String, Object> payload) {
        try {
            Long idUsuario = Long.valueOf(payload.get("idUsuario").toString());
            Integer puntuacionNueva = (Integer) payload.get("puntuacion");

            Map<String, Object> libroData = (Map<String, Object>) payload.get("libro");
            String isbn = (String) libroData.get("isbn");

            // 1. Buscamos o creamos el libro con los datos base de Google
            Libro libro = libroRepository.findByIsbn(isbn)
                    .orElseGet(() -> {
                        Libro nuevo = new Libro();
                        nuevo.setIsbn(isbn);
                        nuevo.setTitulo((String) libroData.get("titulo"));
                        nuevo.setAutor((String) libroData.get("autor"));
                        nuevo.setFotoPortada((String) libroData.get("portada"));
                        nuevo.setDescripcion((String) libroData.get("descripcion"));
                        nuevo.setFechaPublicacion((String) libroData.get("fechaPublicacion"));
                        nuevo.setPaginas((Integer) libroData.get("paginas"));
                        nuevo.setGeneros((String) libroData.get("generos"));

                        // Guardamos los votos y valoración de Google como punto de partida
                        Object vG = libroData.get("votos");
                        Object rG = libroData.get("valoracion");
                        nuevo.setVotos(vG != null ? (Integer) vG : 0);
                        nuevo.setValoracion(rG != null ? Double.valueOf(rG.toString()) : 0.0);

                        return libroRepository.save(nuevo);
                    });

            // 2. Buscamos si el usuario ya tenía una review/voto previo
            Review review = reviewRepository.findByUsuario_IdUsuarioAndLibro_IdLibro(idUsuario, libro.getIdLibro())
                    .orElse(new Review());

            boolean esNuevoVoto = (review.getIdReview() == null);
            int puntuacionAnterior = !esNuevoVoto ? review.getPuntuacion() : 0;

            if (esNuevoVoto) {
                Usuario usuario = usuarioRepository.findById(idUsuario)
                        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                review.setUsuario(usuario);
                review.setLibro(libro);
            }

            // 3. Guardamos el voto del usuario
            review.setPuntuacion(puntuacionNueva);
            review.setFecha(LocalDate.now().toString());
            reviewRepository.save(review);

            // 4. Suma ponderada sobre la base existente
            int votosBase = libro.getVotos();
            double valoracionBase = libro.getValoracion();

            if (esNuevoVoto) {
                // Caso A: Voto nuevo. Incrementamos el contador y ajustamos el promedio.
                int nuevosVotosTotal = votosBase + 1;
                double nuevaVal = ((valoracionBase * votosBase) + puntuacionNueva) / nuevosVotosTotal;

                libro.setVotos(nuevosVotosTotal);
                libro.setValoracion(nuevaVal);
            } else {
                // Caso B: El usuario cambia su nota. El contador no sube, solo ajustamos el
                // promedio.
                double nuevaVal = ((valoracionBase * votosBase) - puntuacionAnterior + puntuacionNueva) / votosBase;
                libro.setValoracion(nuevaVal);
            }

            // 5. Guardamos el libro actualizado
            libroRepository.save(libro);

            return ResponseEntity.ok(Map.of(
                    "mensaje", "Estadísticas actualizadas con éxito",
                    "votos", libro.getVotos(),
                    "valoracion", libro.getValoracion()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar el voto: " + e.getMessage());
        }
    }

    @PostMapping("/resenar")
    public ResponseEntity<?> registrarResena(@RequestBody Map<String, Object> payload) {
        try {
            if (payload.get("idUsuario") == null || payload.get("idLibro") == null) {
                return ResponseEntity.badRequest().body("Error: El ID del usuario o del libro es nulo.");
            }

            Long idUsuario = Long.valueOf(payload.get("idUsuario").toString());
            Long idLibro = Long.valueOf(payload.get("idLibro").toString());
            String contenido = (String) payload.get("contenido");

            Review review = reviewRepository.findByUsuario_IdUsuarioAndLibro_IdLibro(idUsuario, idLibro)
                    .orElseThrow(() -> new RuntimeException(
                            "Debes votar el libro antes de reseñarlo. No se encontró un voto previo."));

            review.setContenido(contenido);
            reviewRepository.save(review);

            return ResponseEntity.ok(Map.of("mensaje", "Reseña guardada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error en el servidor: " + e.getMessage());
        }
    }

    @PostMapping("/borrar-comentario")
    public ResponseEntity<?> borrarComentario(@RequestBody Map<String, Object> payload) {
        try {
            Long idUsuario = Long.valueOf(payload.get("idUsuario").toString());
            Long idLibro = Long.valueOf(payload.get("idLibro").toString());

            Review review = reviewRepository.findByUsuario_IdUsuarioAndLibro_IdLibro(idUsuario, idLibro)
                    .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));

            // Limpiamos el texto pero mantenemos la puntuación
            review.setContenido(null);
            reviewRepository.save(review);

            return ResponseEntity.ok(Map.of("mensaje", "Comentario eliminado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Obtiene la review (voto y contenido) de un usuario específico para un libro.
     */
    @GetMapping("/usuario/{idUsuario}/libro/{idLibro}")
    public ResponseEntity<Review> obtenerVotoUsuario(@PathVariable Long idUsuario, @PathVariable Long idLibro) {
        return reviewRepository.findByUsuario_IdUsuarioAndLibro_IdLibro(idUsuario, idLibro)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    /**
     * Obtiene todas las reviews de un libro específico.
     */
    @GetMapping("/libro/{idLibro}")
    public List<Review> obtenerReviewsPorLibro(@PathVariable Long idLibro) {
        return reviewRepository.findByLibroIdLibro(idLibro);
    }

    @GetMapping("/usuario/{idUsuario}/total")
    public ResponseEntity<List<Review>> obtenerReviewsUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(reviewRepository.findByUsuario_IdUsuario(idUsuario));
    }

    // Obtiene una recomendación aleatoria de 5 estrellas de un amigo
    @GetMapping("/recomendacion-amigo/{idUsuario}")
    public ResponseEntity<?> obtenerRecomendacionAmigo(@PathVariable Long idUsuario) {
        
        // Obtenemos los amigos confirmados del usuario
        List<Usuario> misAmigos = amistadService.obtenerListaAmigos(idUsuario);

        // Si el usuario es nuevo y no tiene amigos, cortamos aquí y mandamos al Frontend al Plan B
        if (misAmigos == null || misAmigos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Extraemos solo los IDs de los amigos para filtrar rápido
        List<Long> idsAmigos = misAmigos.stream()
                .map(Usuario::getIdUsuario)
                .collect(java.util.stream.Collectors.toList());

        // Buscamos todas las reviews con la nota máxima (4 o 5, lo que prefieras)
        List<Review> reviewsPerfectas = reviewRepository.findByPuntuacion(5);

        // Filtramos para quedarnos SOLO con las reviews de la lista de mis amigos
        List<Review> deAmigos = reviewsPerfectas.stream()
                .filter(r -> r.getUsuario() != null && idsAmigos.contains(r.getUsuario().getIdUsuario()))
                .collect(java.util.stream.Collectors.toList());

        if (deAmigos.isEmpty()) {
            // Si tienes amigos pero ninguno ha dado 5 estrellas a nada, activamos Plan B
            return ResponseEntity.notFound().build();
        }

        // Barajamos la lista para dar una recomendación aleatoria
        java.util.Collections.shuffle(deAmigos);
        Review reviewGanadora = deAmigos.get(0);

        // Devolvemos la información limpia
        return ResponseEntity.ok(Map.of(
            "libro", reviewGanadora.getLibro(),
            "nombreAmigo", reviewGanadora.getUsuario().getNombreUsuario() 
        ));
    }

    @PostMapping
    public ResponseEntity<?> crearReviewDesdeProgreso(@RequestBody Map<String, Object> payload) {
        try {
            // Extraemos los IDs y datos del JSON del Frontend
            Long idUsuario = Long.valueOf(payload.get("idUsuario").toString());
            Long idLibro = Long.valueOf(payload.get("idLibro").toString());
            Integer estrellas = Integer.valueOf(payload.get("puntuacion").toString());
            String comentario = (String) payload.get("comentario");

            // Buscamos las entidades en la BD para asegurar las relaciones de la tabla cruzada
            var usuario = usuarioRepository.findById(idUsuario).orElse(null);
            var libro = libroRepository.findById(idLibro).orElse(null);

            if (usuario == null || libro == null) {
                return ResponseEntity.badRequest().body("Error: Usuario o Libro no localizados en el sistema.");
            }

            // Creamos y rellenamos la nueva entidad Review
            Review nuevaReview = new Review();
            nuevaReview.setUsuario(usuario);
            nuevaReview.setLibro(libro);
            nuevaReview.setPuntuacion(estrellas);
            //nuevaReview.setComentario(comentario);
            
            // Si vuestra entidad guarda la fecha de la reseña, descomenta esta línea:
            // nuevaReview.setFecha(java.time.LocalDateTime.now());

            reviewRepository.save(nuevaReview);

            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al procesar la valoración: " + e.getMessage());
        }
    }

}