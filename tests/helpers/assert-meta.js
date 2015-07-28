var _assertMeta = function(isAll, obj, assert) {
  let fetchedAt = obj['__data_offline_meta__'].fetchedAt;
  assert.ok(fetchedAt, "Record meta present");
  if (!isAll) {
    let updatedAt = obj['__data_offline_meta__'].updatedAt;
    assert.ok(updatedAt, "Record meta present");
  }
};

var assertRecordMeta = function assertRecordMeta(obj, assert) {
  _assertMeta(false, obj, assert);
};

var assertCollectionMeta = function assertCollectionMeta(obj, assert) {
  _assertMeta(true, obj, assert);
};

export { assertRecordMeta, assertCollectionMeta };
