import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonajeInterfaz, Root } from '../common/personaje-interfaz';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private Url = "https://dragonball-api.com/api/characters"
  constructor(private http: HttpClient){}

  getCharacters():Observable<Root>{
    return this.http.get<Root>(this.Url);
  }

  getCharactersByUrl(url: string):Observable<Root>{
    return this.http.get<Root>(url);
  }

  getCharacter(id: number):Observable<PersonajeInterfaz>{
    return this.http.get<PersonajeInterfaz>(this.Url + '/' + id)
  }
}
