// package: neo.fs.v2.status
// file: status/types.proto

import * as jspb from "google-protobuf";

export class Status extends jspb.Message {
  getCode(): number;
  setCode(value: number): void;

  getMessage(): string;
  setMessage(value: string): void;

  clearDetailsList(): void;
  getDetailsList(): Array<Status.Detail>;
  setDetailsList(value: Array<Status.Detail>): void;
  addDetails(value?: Status.Detail, index?: number): Status.Detail;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Status.AsObject;
  static toObject(includeInstance: boolean, msg: Status): Status.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Status, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Status;
  static deserializeBinaryFromReader(message: Status, reader: jspb.BinaryReader): Status;
}

export namespace Status {
  export type AsObject = {
    code: number,
    message: string,
    detailsList: Array<Status.Detail.AsObject>,
  }

  export class Detail extends jspb.Message {
    getId(): number;
    setId(value: number): void;

    getValue(): Uint8Array | string;
    getValue_asU8(): Uint8Array;
    getValue_asB64(): string;
    setValue(value: Uint8Array | string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Detail.AsObject;
    static toObject(includeInstance: boolean, msg: Detail): Detail.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Detail, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Detail;
    static deserializeBinaryFromReader(message: Detail, reader: jspb.BinaryReader): Detail;
  }

  export namespace Detail {
    export type AsObject = {
      id: number,
      value: Uint8Array | string,
    }
  }
}

export interface SectionMap {
  SECTION_SUCCESS: 0;
  SECTION_FAILURE_COMMON: 1;
  SECTION_OBJECT: 2;
  SECTION_CONTAINER: 3;
  SECTION_SESSION: 4;
}

export const Section: SectionMap;

export interface SuccessMap {
  OK: 0;
}

export const Success: SuccessMap;

export interface CommonFailMap {
  INTERNAL: 0;
  WRONG_MAGIC_NUMBER: 1;
}

export const CommonFail: CommonFailMap;

export interface ObjectMap {
  ACCESS_DENIED: 0;
  OBJECT_NOT_FOUND: 1;
  LOCKED: 2;
  LOCK_NON_REGULAR_OBJECT: 3;
  OBJECT_ALREADY_REMOVED: 4;
}

export const Object: ObjectMap;

export interface ContainerMap {
  CONTAINER_NOT_FOUND: 0;
}

export const Container: ContainerMap;

export interface SessionMap {
  TOKEN_NOT_FOUND: 0;
  TOKEN_EXPIRED: 1;
}

export const Session: SessionMap;

