export type Priority = 'baja' | 'media' | 'alta' | 'crítica';
export type Status = 'pendiente' | 'en revisión' | 'aprobada' | 'rechazada' | 'cerrada';
export type Category = 'infraestructura' | 'recursos_humanos' | 'financiero' | 'administrativo' | 'tecnología';

export interface Solicitud {
  id: number;
  title: string;
  description: string;
  requester: string;
  category: Category;
  priority: Priority;
  status: Status;
  creationDate: string;
  lastChangeDate: string;
}

export interface CreateSolicitudDTO {
  title: string;
  description: string;
  requester: string;
  category: Category;
  priority: Priority;
}

export interface UpdateSolicitudDTO extends CreateSolicitudDTO {
  status: Status;
}

export interface UpdatePrioritySolicitudDTO {
  priority: Priority;
}