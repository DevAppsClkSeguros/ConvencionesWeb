export interface VersionAppResponse {
  response: Version[];
  status:   boolean;
  message:  string[];
}

export interface Version {
  id:                 number;
  version_Android:    string;
  version_IOs:        string;
  version_Huawei:     string;
  token_Map_Box:      string;
  fecha:              Date;
}
