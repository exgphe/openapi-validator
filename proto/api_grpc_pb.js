// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var proto_api_pb = require('../proto/api_pb.js');

function serialize_openapi_validator_ValidationRequest(arg) {
  if (!(arg instanceof proto_api_pb.ValidationRequest)) {
    throw new Error('Expected argument of type openapi_validator.ValidationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_openapi_validator_ValidationRequest(buffer_arg) {
  return proto_api_pb.ValidationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_openapi_validator_ValidationResponse(arg) {
  if (!(arg instanceof proto_api_pb.ValidationResponse)) {
    throw new Error('Expected argument of type openapi_validator.ValidationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_openapi_validator_ValidationResponse(buffer_arg) {
  return proto_api_pb.ValidationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ApiService = exports.ApiService = {
  validate: {
    path: '/openapi_validator.Api/Validate',
    requestStream: false,
    responseStream: false,
    requestType: proto_api_pb.ValidationRequest,
    responseType: proto_api_pb.ValidationResponse,
    requestSerialize: serialize_openapi_validator_ValidationRequest,
    requestDeserialize: deserialize_openapi_validator_ValidationRequest,
    responseSerialize: serialize_openapi_validator_ValidationResponse,
    responseDeserialize: deserialize_openapi_validator_ValidationResponse,
  },
};

exports.ApiClient = grpc.makeGenericClientConstructor(ApiService);
