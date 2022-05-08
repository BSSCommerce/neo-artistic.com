// package: neo.fs.v2.lock
// file: lock/types.proto

import * as jspb from "google-protobuf";
import * as refs_types_pb from "../refs/types_pb";

export class Lock extends jspb.Message {
  clearMembersList(): void;
  getMembersList(): Array<refs_types_pb.ObjectID>;
  setMembersList(value: Array<refs_types_pb.ObjectID>): void;
  addMembers(value?: refs_types_pb.ObjectID, index?: number): refs_types_pb.ObjectID;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Lock.AsObject;
  static toObject(includeInstance: boolean, msg: Lock): Lock.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Lock, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Lock;
  static deserializeBinaryFromReader(message: Lock, reader: jspb.BinaryReader): Lock;
}

export namespace Lock {
  export type AsObject = {
    membersList: Array<refs_types_pb.ObjectID.AsObject>,
  }
}

