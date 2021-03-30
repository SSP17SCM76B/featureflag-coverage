import { Injectable } from '@angular/core';

import { find, filter } from 'lodash'
import { Observable, throwError } from 'rxjs';

import { ApiService, DomainDataService, TelemetryService, RequestMethod } from '@stratus/stratus-platform';

import {
  StratusAuthApplication,
  StratusAuthConstant,
  StratusAuthGroup,
  StratusAuthInvitation,
  StratusAuthNewInvitation,
  StratusAuthRole,
  StratusAuthRoleGroup,
  StratusAuthUser,
  StratusAuthUserGroup
} from './admin-api.models';

// API Endpoint
export class ApiEndpoint {
  constructor(
    public environment: string,
    public url: string
  ) { }
}

// API Error
export class ApiError {
  constructor(
    public status?: number,
    public message?: string,
    public messages?: string[]
  ) { }
}

const apiPaths = {
  apps: 'api/v2/apps',
  constants: 'api/v2/constants',
  groups: 'api/v2/groups',
  users: 'api/v2/users',
  usersExternal: 'api/v2/users/external'
}

@Injectable()
export class AdminApiService {

  private apiEndpoint: ApiEndpoint;

  private cachedAuthApps: Observable<StratusAuthApplication[]>
  private cachedGroups: Observable<StratusAuthGroup[]>
  private cachedExternalUsers: Observable<StratusAuthUser[]>

  constructor(
    private apiCom: ApiService,
    domainData: DomainDataService,
    private telemetry: TelemetryService
  ) {
    this.apiEndpoint = new ApiEndpoint(domainData.getEnvironment(), domainData.getAuthServiceUri())
  }

  public getApp(appId: number): Observable<StratusAuthApplication> {
    return this.getApps().map(x => find(x, ['applicationId', appId]));
  }

  public getAppByName(appName: string): Observable<StratusAuthApplication> {
    return this.getApps().map(x => find(x, ['name', appName]));
  }

  public getApps(): Observable<StratusAuthApplication[]> {
    if (this.cachedAuthApps === null || this.cachedAuthApps === undefined) {
      const url = `${this.apiEndpoint.url}${apiPaths['apps']}`;
      this.cachedAuthApps = this.requestUrl<StratusAuthApplication[]>(url, RequestMethod.Get).shareReplay(1);
    }
    return this.cachedAuthApps;
  }

  public getCompanies(): Observable<StratusAuthConstant[]> {
    const url = `${this.apiEndpoint.url}${apiPaths['constants']}/company`;
    return this.requestUrl(url, RequestMethod.Get);
  }

  public getGroup(groupId: number): Observable<StratusAuthGroup> {
    return this.getGroups().map(x => find(x, ['groupId', groupId]));
  }

  public getGroupByName(groupName: string): Observable<StratusAuthGroup> {
    return this.getGroups().map(x => find(x, ['name', groupName]));
  }

  public getGroupDetails(groupId: number): Observable<StratusAuthGroup> {
    const url = `${this.apiEndpoint.url}${apiPaths['groups']}/${groupId}?includeRelated=true`;
    return this.requestUrl(url, RequestMethod.Get);
  }

  public getGroupsExternal(): Observable<StratusAuthGroup[]> {
    return this.getGroups().map(x => filter(x, ['isExternal', true]));
  }

  public getGroupsInternal(): Observable<StratusAuthGroup[]> {
    return this.getGroups().map(x => filter(x, ['isExternal', false]));
  }

  public getGroups(): Observable<StratusAuthGroup[]> {
    if (this.cachedGroups === null || this.cachedGroups === undefined) {
      const url = `${this.apiEndpoint.url}${apiPaths['groups']}`;
      this.cachedGroups = this.requestUrl<StratusAuthGroup[]>(url, RequestMethod.Get).shareReplay(1);
    }
    return this.cachedGroups;
  }

  public getRoles(appId: number): Observable<StratusAuthRole[]> {
    const url = `${this.apiEndpoint.url}${apiPaths['apps']}/${appId}/roles?includeRelated=true`;
    return this.requestUrl(url, RequestMethod.Get);
  }

  public getUser(userId: number): Observable<StratusAuthUser> {
    const url = `${this.apiEndpoint.url}${apiPaths['users']}/${userId}?includeRelated=true`;
    return this.requestUrl(url, RequestMethod.Get);
  }

  public getUserByEmailAddress(emailAddress: string): Observable<StratusAuthUser> {
    return this.getUsersExternal().map(x => find(x, ['emailAddress', emailAddress]));
  }

  public getUsersExternal(): Observable<StratusAuthUser[]> {
    if (this.cachedExternalUsers === null || this.cachedExternalUsers === undefined) {
      const url = `${this.apiEndpoint.url}${apiPaths['usersExternal']}`;
      this.cachedExternalUsers = this.requestUrl<StratusAuthUser[]>(url, RequestMethod.Get).shareReplay(1);
    }
    return this.cachedExternalUsers;
  }

  public resendInvitation(upn: string, invitation: StratusAuthInvitation): Observable<StratusAuthInvitation> {
    const url = `${this.apiEndpoint.url}${apiPaths['users']}/${upn}/reinvite`;
    return this.requestUrl(url, RequestMethod.Post, invitation);
  }

  public updateApp(app: StratusAuthApplication): Observable<StratusAuthApplication> {
    this.cachedAuthApps = null;
    const url = `${this.apiEndpoint.url}${apiPaths['apps']}/${app.applicationId}`;
    return this.requestUrl(url, RequestMethod.Put, app);
  }

  public updateGroup(group: StratusAuthGroup): Observable<StratusAuthGroup> {
    this.cachedGroups = null;
    const url = `${this.apiEndpoint.url}${apiPaths['groups']}/${group.groupId}`;
    return this.requestUrl(url, RequestMethod.Put, group);
  }

  public updateUser(user: StratusAuthUser): Observable<StratusAuthUser> {
    this.cachedExternalUsers = null;
    const url = `${this.apiEndpoint.url}${apiPaths['users']}/${user.userId}`;
    return this.requestUrl(url, RequestMethod.Put, user);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Private
  /////////////////////////////////////////////////////////////////////////////////////////////////

  private handleHttpError(error) {
    const apiError = new ApiError(error.status, 'An unexpected error occurred.');
    switch (error.status) {
      case 400:
        apiError.message = 'The request was not valid.';
        if (error.data && error.data.ModelState) {
          apiError.messages = [];
          for (const propertyName of error.data.ModelState) {
            apiError.messages.push(error.data.ModelState[propertyName]);
          }
        }
        break;
      case 401:
      case 403:
        apiError.message = 'You are not authorized to access this resource.';
        break;
      case 404:
        apiError.message = 'The requested resource was not found.';
        break;
      case 409:
        apiError.message = 'The request could not be completed on the backend server.';
        break;
      case 500:
        apiError.message = 'An error occurred on the backend server.';
        break;
      default:
    }
    return throwError(apiError);
  }

  private requestUrl<TResult>(
    url: string,
    httpMethod: string,
    body?: Object): Observable<TResult> {
    return this.apiCom.executeApiRequest<TResult>({
      url,
      method: httpMethod,
      logger: this.telemetry,
      body
    })
      .map(response => response.body)
      .catch(error => this.handleHttpError(error))
  }
}
