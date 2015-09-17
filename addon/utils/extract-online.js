/**
@module utils
@class ExtractOnline
**/

/**
Extracts the record from the payload of your backend.

@method extractTargetRecordFromPayload
@param store {DS.Store}
@param typeClass {DS.Model}
@param recordToExtractFrom  {Object} payload from which the record will be extracted
@return extracted target {Object}
**/
var extractTargetRecordFromPayload = function extractTargetRecordFromPayload(store, typeClass, recordToExtractFrom) {
  let modelName = typeClass.modelName;
  let serializer = store.serializerFor(modelName);
  let payload = serializer.normalizePayload(recordToExtractFrom);
  let modelNameInPayload = Object.keys(payload).filter(key => {
    return serializer.modelNameFromPayloadKey(key) === modelName;
  })[0];
  if (!modelNameInPayload) {
    return null;
  }
  return payload[modelNameInPayload];
};

export { extractTargetRecordFromPayload };
export default extractTargetRecordFromPayload;
