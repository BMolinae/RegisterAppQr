export interface Asistencia {
    fecha: string;
    seccion: string;
    sala: string;
    profesor: string;
  }
  
  export interface Clase {
    nombre: string;
    seccion: string;
    sala: string;
    profesor: string;
    asistencias: Asistencia[];
  }
  