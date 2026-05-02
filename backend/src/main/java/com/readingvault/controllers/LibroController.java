package com.readingvault.controllers;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.readingvault.dto.LibroExternoDTO;
import com.readingvault.models.Libro;
import com.readingvault.repositories.LibroRepository;
import com.readingvault.services.GoogleBooksService;

@RestController
@RequestMapping("/api/libros")
@CrossOrigin(origins = "*")
public class LibroController {

    @Autowired
    private GoogleBooksService googleBooksService;

    @Autowired
    private LibroRepository libroRepository;

    /**
     * Mapea un Libro de nuestra base de datos al formato del Frontend.
     */
    private Map<String, Object> mapearLibroLocal(Libro libro) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("idLibro", libro.getIdLibro());
        respuesta.put("titulo", libro.getTitulo());
        respuesta.put("autor", libro.getAutor());
        respuesta.put("portada", libro.getFotoPortada());
        respuesta.put("fotoPortada", libro.getFotoPortada());
        respuesta.put("valoracion", libro.getValoracion());
        respuesta.put("votos", libro.getVotos());
        respuesta.put("descripcion", libro.getDescripcion());
        respuesta.put("isbn", libro.getIsbn());
        respuesta.put("fechaPublicacion", libro.getFechaPublicacion());
        respuesta.put("paginas", libro.getPaginas());
        respuesta.put("generos", libro.getGeneros());
        return respuesta;
    }

    /**
     * Mapea los datos de la API externa.
     */
    private Map<String, Object> mapearLibro(LibroExternoDTO libro) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("titulo", libro.getTitle());
        respuesta.put("autor", (libro.getAuthorNames() != null && !libro.getAuthorNames().isEmpty())
                ? libro.getAuthorNames().get(0)
                : "Autor desconocido");
        
        respuesta.put("portada", libro.getCoverId());
        respuesta.put("fotoPortada", libro.getCoverId());
        respuesta.put("valoracion", libro.getAverageRating());
        respuesta.put("votos", libro.getRatingsCount());
        respuesta.put("descripcion", libro.getDescription()); 
        respuesta.put("isbn", libro.getIsbn());
        respuesta.put("fechaPublicacion", libro.getPublishedDate());
        respuesta.put("paginas", libro.getPageCount());
        
        String categoriasStr = (libro.getCategories() != null) 
                ? String.join(", ", libro.getCategories()) 
                : "General";
        respuesta.put("generos", categoriasStr);
        return respuesta;
    }

    /**
     * Mapea los datos de la API externa pero verificando si el libro existe localmente
     * para sobreescribir con los votos y valoración de Reading Vault.
     */
    private Map<String, Object> mapearYEnriquecerLibro(LibroExternoDTO libroExt) {
        Map<String, Object> respuesta = new HashMap<>();
        String isbn = libroExt.getIsbn();

        // Valores base de la API externa
        respuesta.put("titulo", libroExt.getTitle());
        respuesta.put("autor", (libroExt.getAuthorNames() != null && !libroExt.getAuthorNames().isEmpty())
                ? libroExt.getAuthorNames().get(0)
                : "Autor desconocido");
        
        respuesta.put("portada", libroExt.getCoverId());
        respuesta.put("fotoPortada", libroExt.getCoverId());
        respuesta.put("descripcion", libroExt.getDescription()); 
        respuesta.put("isbn", isbn);
        respuesta.put("fechaPublicacion", libroExt.getPublishedDate());
        respuesta.put("paginas", libroExt.getPageCount());
        
        String categoriasStr = (libroExt.getCategories() != null) 
                ? String.join(", ", libroExt.getCategories()) 
                : "General";
        respuesta.put("generos", categoriasStr);

        // Buscamos si existe en nuestra BD para priorizar nuestros votos/estrellas
        Optional<Libro> localOpt = libroRepository.findByIsbn(isbn);
        
        if (localOpt.isPresent()) {
            Libro local = localOpt.get();
            respuesta.put("valoracion", local.getValoracion());
            respuesta.put("votos", local.getVotos());
            respuesta.put("idLibro", local.getIdLibro()); // Lo añadimos si existe localmente
        } else {
            // Si no existe, usamos los de Google
            respuesta.put("valoracion", libroExt.getAverageRating());
            respuesta.put("votos", libroExt.getRatingsCount());
        }
        
        return respuesta;
    }

    /**
     * Busca libros y enriquece los resultados con datos de la BD local.
     */
    @GetMapping("/buscar")
    public List<Map<String, Object>> buscar(
            @RequestParam String q,
            @RequestParam(defaultValue = "1") int pagina,
            @RequestParam(defaultValue = "relevance") String orderBy) {

        // Obtenemos resultados de Google
        List<LibroExternoDTO> librosExternos = googleBooksService.buscarLibros(q, pagina, orderBy);

        // Filtramos por ISBN único
        Map<String, LibroExternoDTO> filtrados = new LinkedHashMap<>();
        for (LibroExternoDTO dto : librosExternos) {
            String isbn = dto.getIsbn();
            if (isbn != null && !isbn.isEmpty() && !isbn.equalsIgnoreCase("null")) {
                filtrados.putIfAbsent(isbn, dto);
            }
        }

        // Mapeamos usando la nueva función de enriquecimiento
        return filtrados.values().stream()
                .limit(12)
                .map(this::mapearYEnriquecerLibro)
                .collect(Collectors.toList());
    }

    /**
     * Busca un libro específico prioritariamente por ISBN.
     */
    @GetMapping("/buscar-unico")
    public ResponseEntity<?> buscarUnico(
            @RequestParam(required = false) String isbn,
            @RequestParam(required = false) String titulo, 
            @RequestParam(required = false) String autor) {
        
        // 1. Intentar buscar en la BD Local por ISBN (es lo más seguro)
        if (isbn != null && !isbn.isEmpty()) {
            Optional<Libro> porIsbn = libroRepository.findByIsbn(isbn);
            if (porIsbn.isPresent()) {
                return ResponseEntity.ok(mapearLibroLocal(porIsbn.get()));
            }
        }

        // 2. Si no hay ISBN o no se encontró, intentar por Título y Autor en BD Local
        if (titulo != null && autor != null) {
            Optional<Libro> porDatos = libroRepository.findByTituloAndAutor(titulo, autor);
            if (porDatos.isPresent()) {
                return ResponseEntity.ok(mapearLibroLocal(porDatos.get()));
            }
        }

        // 3. Si no existe localmente, ir a Google Books (preferiblemente por ISBN)
        String queryBusqueda = (isbn != null && !isbn.isEmpty()) ? "isbn:" + isbn : titulo + " " + autor;
        List<LibroExternoDTO> resultados = googleBooksService.buscarLibros(queryBusqueda, 1, "relevance");
        
        if (resultados != null && !resultados.isEmpty()) {
            return ResponseEntity.ok(mapearLibro(resultados.get(0)));
        }
        
        return ResponseEntity.notFound().build();
    }
}