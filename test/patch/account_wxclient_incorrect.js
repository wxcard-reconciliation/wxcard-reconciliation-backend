// account wxclient incorrect js for mongodb

var staffs = db.cardevent.aggregate([
  {$match: {"cancelBy": null, status: "consumed", CardId: {$in: ['pAtUNs2kaIzJjl6ZXUO-fMP_KabQ', 'pAtUNs5y63pZFOCoOD6V8pg4bMQk', 'pAtUNsyFRkWSW8D92mnqKyvNJFVA']}}},
  {$project: {StaffOpenId: 1}},
  {$group: {_id: "$StaffOpenId"}}
]);

staffs.forEach(function (staff) {
  printjson(staff)
  var account = db.account.findOne({"wxclient.id": staff._id});
  if(account) {
    var results = db.cardevent.update({StaffOpenId: staff._id}, {$set: {cancelBy: account}}, {multi: true});
    printjson(results);
  }
});