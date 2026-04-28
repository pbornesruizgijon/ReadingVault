package com.readingvault.controllers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readingvault.models.Usuario;
import com.readingvault.security.JwtUtil;
import com.readingvault.services.UsuarioService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://127.0.0.1:5173")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String identifier = loginRequest.get("usernameOrEmail");
        String password = loginRequest.get("password");

        if (identifier == null) {
            identifier = loginRequest.get("email");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(identifier, password));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Credenciales incorrectas");
        }

        // Generamos el token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(identifier);
        final String token = jwtUtil.generateToken(userDetails.getUsername());

        // Buscamos al usuario en la DB
        Usuario userDb = usuarioService.buscarPorEmail(userDetails.getUsername())
                .orElseGet(() -> usuarioService.buscarPorNombreUsuario(userDetails.getUsername()).orElse(null));

        if (userDb == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        // 1. ACTUALIZAR CONEXIÓN (Sin encriptar de nuevo la pass)
        userDb.setUltimaConexion(LocalDateTime.now());
        usuarioService.guardarSinEncriptar(userDb); 

        // 2. CONSTRUIR RESPUESTA SEGURA (Sin password)
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("idUsuario", userDb.getIdUsuario());
        userData.put("nombreUsuario", userDb.getNombreUsuario());
        userData.put("email", userDb.getEmail());
        userData.put("fotoPerfil", userDb.getFotoPerfil());
        userData.put("rol", userDb.getRol());
        // Añadimos estos para que el perfil no salga vacío al loguear
        userData.put("localidad", userDb.getLocalidad());
        userData.put("biografia", userDb.getBiografia());
        
        response.put("user", userData); 
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        // Validación de email
        if (usuarioService.buscarPorEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: El email ya está registrado");
        }
        // Validación de nombre de usuario
        if (usuarioService.buscarPorNombreUsuario(usuario.getNombreUsuario()).isPresent()){
            return ResponseEntity.badRequest().body("Error: El nombre de usuario ya existe");
        }

        // El método registrarUsuario debe encargarse de encriptar la pass
        Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
        return ResponseEntity.ok("Usuario registrado con éxito: " + nuevoUsuario.getNombreUsuario());
    }
}
