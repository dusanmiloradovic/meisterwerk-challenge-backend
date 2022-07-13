export const GET_ALL_EVENTS =
  'select events_id,title,start_time,end_time,status,a.address from events e, addresses a where a.address_id=e.address_id and start_time between 1656619200000 and 1659211200000  limit 100'; //limit records for the demo only July
export const INSERT_EVENT = 'insert into events(title,start_time,end_time,status,address_id) values(?,?,?,?,?)';
export const GET_ADDRESS_ID = 'select address_id from addresses where address=?';
export const INSERT_ADDRESS = 'insert into addresses(address) values(?)';
export const GET_EVENTS_RANGE =
  'select events_id,title,start_time,end_time, status,a.address from events e, addresses a where a.address_id=e.address_id and start_time between ? and ? limit 100';
