package Contenido;

import java.sql.Connection;
import Contenido.Acceso_a_Datos.ConectividadSQL;

public class Main {
    public static void main(String[] args) {
        Connection conn = ConectividadSQL.obtenerConexion();
        if (conn != null) {
            System.out.println("¡Conexión a la base de datos establecida correctamente!");
        } else {
            System.out.println("Error al conectar con la base de datos.");
        }
    }
}
