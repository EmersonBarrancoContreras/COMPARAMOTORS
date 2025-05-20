// role.service.ts
import { EnvironmentInjector, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { environment } from '@environments/environments';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = inject(EnvironmentInjector).get(environment).apiUrl;

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  updateRole(id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addPermissionToRole(roleId: number, permissionId: number): Observable<Role> {
    return this.http.post<Role>(
      `${this.apiUrl}/${roleId}/permissions/${permissionId}`,
      {}
    );
  }

  removePermissionFromRole(
    roleId: number,
    permissionId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${roleId}/permissions/${permissionId}`
    );
  }
}
