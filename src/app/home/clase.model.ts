export interface Asistencia {
  fecha: string;  // Fecha y hora de la asistencia
  asignatura: string; // Nombre de la asignatura
  seccion: string;
  sala: string;
  estado?: string; // Estado de la asistencia (Presente, Ausente)
}

export interface Clase {
  id: string;
  nombre: string;
  seccion: string;
  sala: string;
  profesor: string;
  asistencias: Asistencia[]; // Usar la interfaz Asistencia
  horarios: string[];
  mostrarHorario: boolean;
  mostrarAsistencia: boolean; // Propiedad para manejar la visibilidad de las asistencias
}