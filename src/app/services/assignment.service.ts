import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private assignmentsSubject = new BehaviorSubject<any[]>([]);
  assignments$ = this.assignmentsSubject.asObservable();

  constructor() {
    const initialAssignments = [
      {
        id: '1',
        nombre: 'PROGRAMACIÓN DE APLICACIONES MÓVILES',
        seccion: 'PGY4121-012D',
        sala: 'L9',
        profesor: 'CARLOS FERNANDO MARTINEZ SANCHEZ',
        asistencias: [],
        horarios: ['Lunes: 8:31 - 10:40', 'Miércoles: 8:31 - 9:50'],
        mostrarAsistencia: false,
      },
      {
        id: '2',
        nombre: 'ÉTICA PARA EL TRABAJO',
        seccion: 'EAY4450-300D',
        sala: '503',
        profesor: 'ESTEBAN SALVATIERRA ROMAN',
        asistencias: [],
        horarios: ['Lunes: 16:01 - 17:20'],
        mostrarAsistencia: false,
      },
      {
        id: '3',
        nombre: 'INGLÉS INTERMEDIO',
        seccion: 'INI5111-019D',
        sala: '607',
        profesor: 'GUSTAVO ALEJANDRO ARIAS BECERRA',
        asistencias: [],
        horarios: ['Martes: 11:31 - 12:50', 'Miércoles: 11:31 - 12:50', 'Jueves: 11:31 - 12:50', 'Viernes: 11:31 - 12:50'],
        mostrarAsistencia: false,
      },
      {
        id: '4',
        nombre: 'PROCESO DE PORTAFOLIO FINAL',
        seccion: 'PY41447-005D',
        sala: '806',
        profesor: 'PATRICIO ANDRES SOTO SERDIO',
        asistencias: [],
        horarios: ['Martes: 13:01 - 14:20'],
        mostrarAsistencia: false,
      },
      {
        id: '5',
        nombre: 'ESTADÍSTICA DESCRIPTIVA',
        seccion: 'MAT4140-012D',
        sala: 'L3',
        profesor: 'KATHERINE DEL CARMEN ENCINA ALARCON',
        asistencias: [],
        horarios: ['Martes: 15:11 - 16:40', 'Viernes: 13:01 - 14:20'],
        mostrarAsistencia: false,
      },
      {
        id: '6',
        nombre: 'ARQUITECTURA',
        seccion: 'ASY4131-012D',
        sala: 'L3',
        profesor: 'EMILIO GONZALO SOTO ROJAS',
        asistencias: [],
        horarios: ['Miércoles: 10:01 - 11:20', 'Jueves: 8:31 - 10:40'],
        mostrarAsistencia: false,
      },
      {
        id: '7',
        nombre: 'CALIDAD DE SOFTWARE',
        seccion: 'CSY4111-011D',
        sala: 'L5',
        profesor: 'PATRICIO ANDRES SOTO SERDIO',
        asistencias: [],
        horarios: ['Miércoles: 15:11 - 16:40', 'Jueves: 14:31 - 15:50'],
        mostrarAsistencia: false,
      }
    ];

    this.assignmentsSubject.next(initialAssignments);
  }

  // Método para registrar la asistencia
  registerAttendance(assignmentId: string, attendance: any): void {
    const currentAssignments = this.assignmentsSubject.value;
    const assignmentIndex = currentAssignments.findIndex(
      (assignment) => assignment.id === assignmentId
    );

    if (assignmentIndex !== -1) {
      currentAssignments[assignmentIndex].asistencias.push(attendance);
      this.assignmentsSubject.next([...currentAssignments]);
    }
  }

  // Método para obtener todas las asignaturas
  getAssignments(): any[] {
    return this.assignmentsSubject.value;
  }

  // Método para actualizar una asignatura
  updateAssignment(updatedAssignment: any): void {
    const currentAssignments = this.assignmentsSubject.value;
    const assignmentIndex = currentAssignments.findIndex(
      (assignment) => assignment.id === updatedAssignment.id
    );

    if (assignmentIndex !== -1) {
      currentAssignments[assignmentIndex] = updatedAssignment;
      this.assignmentsSubject.next([...currentAssignments]);
    }
  }

  // Método para eliminar una asignatura
  deleteAssignment(assignmentId: string): void {
    let currentAssignments = this.assignmentsSubject.value;
    currentAssignments = currentAssignments.filter(
      (assignment) => assignment.id !== assignmentId
    );
    this.assignmentsSubject.next(currentAssignments);
  }
}
