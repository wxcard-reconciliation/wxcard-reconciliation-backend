module.exports = [
  {
    title: "促销活动标题",
    description: "活动描述",
    date_info: {
      type: "DATE_TYPE_FIX_TIME_RANGE",
      begin_timestamp: Math.round(Date.now()/1000),
      end_timestamp: Math.round(Date.now()/1000)+2592000
    },
    location_id_list: ["227049379"]
  }
]