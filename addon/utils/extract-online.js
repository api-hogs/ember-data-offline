import Ember from 'ember';
const { Logger } = Ember;

var extractTargetRecordFromPayload = function extractTargetRecordFromPayload(store, typeClass, recordToExtractFrom) {
  let modelName = typeClass.modelName;
  let payload = store.serializerFor(modelName).normalizePayload(recordToExtractFrom);
  let modelNameInPayload;
  for (var prop in payload) {
    var mName = store.serializerFor(modelName).modelNameFromPayloadKey(prop);
    if (mName === modelName) {
      modelNameInPayload = prop;
      break;
    }
  }
  if (!modelNameInPayload) {
    Logger.error("You try to persist payload that doesn't have any properties for model:", typeClass, "Please check your API response or serializer");
    return null;
  }
  return payload[modelNameInPayload];
};

export { extractTargetRecordFromPayload };
export default extractTargetRecordFromPayload;
