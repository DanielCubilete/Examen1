export interface Root {
  items: Item[]
  meta: Meta
  links: Links
}

export interface Item {
  id: number
  name: string
  ki: string
  maxKi: string
  race: string
  gender: string
  description: string
  image: string
  affiliation: string
  deletedAt: any
}

export interface Meta {
  totalItems: number
  itemCount: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
}

export interface Links {
  first: string
  previous: string
  next: string
  last: string
}

export interface Transformacion {
  id: number;
  name: string;
  image: string;
  ki: string;
}

export interface Planeta {
  id: number;
  name: string;
  isDestroyed: boolean;
  description: string;
  image: string;
}

export interface PersonajeInterfaz {
  id: number
  name: string
  ki: string
  maxKi: string
  race: string
  gender: string
  description: string
  image: string
  affiliation: string
  deletedAt: any
  transformations?: Transformacion[]
  originPlanet?: Planeta
}
