export interface MicrosoftResponse {
  '@odata.context': string;
  '@odata.nextLink': string;
  value: MicrosoftItem[];
}

export interface MicrosoftItem {
  "@microsoft.graph.downloadUrl": string;
  createdDateTime:                Date;
  eTag:                           string;
  id:                             string;
  lastModifiedDateTime:           Date;
  name:                           string;
  webUrl:                         string;
  cTag:                           string;
  size:                           number;
  createdBy:                      EdBy;
  lastModifiedBy:                 EdBy;
  parentReference:                ParentReference;
  file:                           File;
  fileSystemInfo:                 FileSystemInfo;
  image:                          Image;
  photo:                          Photo;
  "thumbnails@odata.context":     string;
  thumbnails:                     Thumbnail[];
}

export interface EdBy {
  application: Application;
  user:        User;
}

export interface Application {
  id:          string;
  displayName: ApplicationDisplayName;
}

export enum ApplicationDisplayName {
  SharePointOnlineClientExtensibility = "SharePoint Online Client Extensibility",
}

export interface User {
  email:       Email;
  id:          string;
  displayName: UserDisplayName;
}

export enum UserDisplayName {
  ContenedorMedios = "contenedor medios",
}

export enum Email {
  MediosGrupobituajCOMMX = "medios@grupobituaj.com.mx",
}

export interface File {
  mimeType: MIMEType;
  hashes:   Hashes;
}

export interface Hashes {
  quickXorHash: string;
}

export enum MIMEType {
  ImagePNG = "image/png",
}

export interface FileSystemInfo {
  createdDateTime:      Date;
  lastModifiedDateTime: Date;
}

export interface Image {
  height: number;
  width:  number;
}

export interface ParentReference {
  driveType: DriveType;
  driveId:   string;
  id:        ID;
  name:      Name;
  path:      Path;
  siteId:    string;
}

export enum DriveType {
  Business = "business",
}

export enum ID {
  The01Gh2Cwjuggjrhlbpkivgyylktajklpyb7 = "01GH2CWJUGGJRHLBPKIVGYYLKTAJKLPYB7",
}

export enum Name {
  Imagenes = "imagenes",
}

export enum Path {
  DriveRootConvencionInternacionalCRImagenes = "/drive/root:/Convencion Internacional CR/imagenes",
}

export interface Photo {
}

export interface Thumbnail {
  id:     string;
  large:  Large;
  medium: Large;
  small:  Large;
}

export interface Large {
  height: number;
  url:    string;
  width:  number;
}
