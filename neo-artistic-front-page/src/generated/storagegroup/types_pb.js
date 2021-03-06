// source: storagegroup/types.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var refs_types_pb = require('../refs/types_pb.js');
goog.object.extend(proto, refs_types_pb);
goog.exportSymbol('proto.neo.fs.v2.storagegroup.StorageGroup', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.neo.fs.v2.storagegroup.StorageGroup = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.neo.fs.v2.storagegroup.StorageGroup.repeatedFields_, null);
};
goog.inherits(proto.neo.fs.v2.storagegroup.StorageGroup, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.neo.fs.v2.storagegroup.StorageGroup.displayName = 'proto.neo.fs.v2.storagegroup.StorageGroup';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.neo.fs.v2.storagegroup.StorageGroup.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.toObject = function(opt_includeInstance) {
  return proto.neo.fs.v2.storagegroup.StorageGroup.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.neo.fs.v2.storagegroup.StorageGroup} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.neo.fs.v2.storagegroup.StorageGroup.toObject = function(includeInstance, msg) {
  var f, obj = {
    validationDataSize: jspb.Message.getFieldWithDefault(msg, 1, 0),
    validationHash: (f = msg.getValidationHash()) && refs_types_pb.Checksum.toObject(includeInstance, f),
    expirationEpoch: jspb.Message.getFieldWithDefault(msg, 3, 0),
    membersList: jspb.Message.toObjectList(msg.getMembersList(),
    refs_types_pb.ObjectID.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.neo.fs.v2.storagegroup.StorageGroup}
 */
proto.neo.fs.v2.storagegroup.StorageGroup.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.neo.fs.v2.storagegroup.StorageGroup;
  return proto.neo.fs.v2.storagegroup.StorageGroup.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.neo.fs.v2.storagegroup.StorageGroup} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.neo.fs.v2.storagegroup.StorageGroup}
 */
proto.neo.fs.v2.storagegroup.StorageGroup.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setValidationDataSize(value);
      break;
    case 2:
      var value = new refs_types_pb.Checksum;
      reader.readMessage(value,refs_types_pb.Checksum.deserializeBinaryFromReader);
      msg.setValidationHash(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setExpirationEpoch(value);
      break;
    case 4:
      var value = new refs_types_pb.ObjectID;
      reader.readMessage(value,refs_types_pb.ObjectID.deserializeBinaryFromReader);
      msg.addMembers(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.neo.fs.v2.storagegroup.StorageGroup.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.neo.fs.v2.storagegroup.StorageGroup} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.neo.fs.v2.storagegroup.StorageGroup.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValidationDataSize();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getValidationHash();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      refs_types_pb.Checksum.serializeBinaryToWriter
    );
  }
  f = message.getExpirationEpoch();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getMembersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      refs_types_pb.ObjectID.serializeBinaryToWriter
    );
  }
};


/**
 * optional uint64 validation_data_size = 1;
 * @return {number}
 */
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.getValidationDataSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.neo.fs.v2.storagegroup.StorageGroup} returns this
 */
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.setValidationDataSize = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional neo.fs.v2.refs.Checksum validation_hash = 2;
 * @return {?proto.neo.fs.v2.refs.Checksum}
 */
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.getValidationHash = function() {
  return /** @type{?proto.neo.fs.v2.refs.Checksum} */ (
    jspb.Message.getWrapperField(this, refs_types_pb.Checksum, 2));
};


/**
 * @param {?proto.neo.fs.v2.refs.Checksum|undefined} value
 * @return {!proto.neo.fs.v2.storagegroup.StorageGroup} returns this
*/
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.setValidationHash = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.neo.fs.v2.storagegroup.StorageGroup} returns this
 */
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.clearValidationHash = function() {
  return this.setValidationHash(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.hasValidationHash = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional uint64 expiration_epoch = 3;
 * @return {number}
 */
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.getExpirationEpoch = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.neo.fs.v2.storagegroup.StorageGroup} returns this
 */
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.setExpirationEpoch = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * repeated neo.fs.v2.refs.ObjectID members = 4;
 * @return {!Array<!proto.neo.fs.v2.refs.ObjectID>}
 */
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.getMembersList = function() {
  return /** @type{!Array<!proto.neo.fs.v2.refs.ObjectID>} */ (
    jspb.Message.getRepeatedWrapperField(this, refs_types_pb.ObjectID, 4));
};


/**
 * @param {!Array<!proto.neo.fs.v2.refs.ObjectID>} value
 * @return {!proto.neo.fs.v2.storagegroup.StorageGroup} returns this
*/
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.setMembersList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.neo.fs.v2.refs.ObjectID=} opt_value
 * @param {number=} opt_index
 * @return {!proto.neo.fs.v2.refs.ObjectID}
 */
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.addMembers = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.neo.fs.v2.refs.ObjectID, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.neo.fs.v2.storagegroup.StorageGroup} returns this
 */
proto.neo.fs.v2.storagegroup.StorageGroup.prototype.clearMembersList = function() {
  return this.setMembersList([]);
};


goog.object.extend(exports, proto.neo.fs.v2.storagegroup);
