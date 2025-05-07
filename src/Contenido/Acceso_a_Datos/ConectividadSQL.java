package Contenido.Acceso_a_Datos;

import java.sql.Connection;
import java.sql.DriverManager;

public class ConectividadSQL {
    public static Connection obtenerConexion() {
       
        String url = "jdbc:postgresql://localhost:5432/biblioteca_alexandria";  // URL de conexión a la base de datos PostgreSQL
        String user = "postgres";  // Usuario de PostgreSQL
        String password = "123456";  // Contraseña de PostgreSQL
        
        Connection conn = null;
        
        try {
            // Establecer la conexión con la base de datos
            conn = DriverManager.getConnection(url, user, password);
            System.out.println("Conexión exitosa!");
        } catch (Exception e) {
            // Manejo de errores si la conexión falla
            e.printStackTrace();
        }
        
        return conn;  // Devuelve la conexión para utilizarla en otras partes del código
    }
}
