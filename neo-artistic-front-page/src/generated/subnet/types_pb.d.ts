// package: neo.fs.v2.subnet
// file: subnet/types.proto

import * as jspb from "google-protobuf";
import * as refs_types_pb from "../refs/types_pb";

export class SubnetInfo extends jspb.Message {
  hasId(): boolean;
  clearId(): void;
  getId(): refs_types_pb.SubnetID | undefined;
  setId(value?: refs_types_pb.SubnetID): void;

  hasOwner(): boolean;
  clearOwner(): void;
  getOwner(): refs_types_pb.OwnerID | undefined;
  setOwner(value?: refs_types_pb.OwnerID): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubnetInfo.AsObject;
  static toObject(includeInstance: boolean, msg: SubnetInfo): SubnetInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubnetInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubnetInfo;
  static deserializeBinaryFromReader(message: SubnetInfo, reader: jspb.BinaryReader): SubnetInfo;
}

export namespace SubnetInfo {
  export type AsObject = {
    id?: refs_types_pb.SubnetID.AsObject,
    owner?: refs_types_pb.OwnerID.AsObject,
  }
}

