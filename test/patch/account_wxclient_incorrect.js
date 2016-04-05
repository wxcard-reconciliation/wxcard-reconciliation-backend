// account wxclient incorrect js for mongodb

var staffs = db.cardevent.aggregate([
  {$match: { "cancelBy.poi": {$exists: false}, status: "consumed", CardId: {$in: [
          'pAtUNsyggXkmG15LTyoEPDGZWPrA',
          'pAtUNs941xXpR6s6FwV22ygbnZFk',
          'pAtUNswA_P0V5tDJKeKv0P7EqF5I',
          'pAtUNs1sa1uyTOpAgvflCDBT67wc',
          'pAtUNs33uwFIOrbw6BVy23yYBLZo',
          'pAtUNs9RpArHsBJNsMIOkKOcvxbo',
          'pAtUNs7xMlcsH77tFiZYJEPz-gH4',
          'pAtUNs7zY1vW_JDYW6jln-hWWYc0',
          'pAtUNsxoq4aEMV2shSjBMKeRHgsA'
  ]}}},
  // {$match: {"cancelBy.poi": {$exists: false}, status: "consumed"}},
  {$project: {StaffOpenId: 1}},
  {$group: {_id: "$StaffOpenId"}}
]);

var count = 0
staffs.forEach(function (staff) {
  // count++;
  // return print(staff._id);
  // printjson(staff)
  var account = db.account.findOne({"wxclient.id": staff._id});
  if(account) {
    var results = db.cardevent.update({StaffOpenId: staff._id}, {$set: {cancelBy: account}}, {multi: true});
    // printjson(results);
  }
});

print(count);