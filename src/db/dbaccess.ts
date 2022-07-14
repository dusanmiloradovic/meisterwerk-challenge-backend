import sqlite3 from 'sqlite3';
import { EventData, EventDataRange } from '../events';
import { GET_ALL_EVENTS, INSERT_EVENT, GET_ADDRESS_ID, INSERT_ADDRESS, GET_EVENTS_RANGE } from './sqlstatements';

const db = new sqlite3.Database(process.env.DB_PATH);

//TODO put the path in dotenv
function getEventFromRow(r: unknown): EventData {
  //defined as any in sqlite3 type definition
  return {
    eventId: r['event_id'],
    title: r['title'],
    startTime: new Date(r['start_time']),
    endTime: new Date(r['end_time']),
    address: r['address'],
    status: r['status'],
  };
}

function getEventDataFromRows(rows: unknown[]): EventData[] {
  const ret: EventData[] = [];
  for (const r of rows) {
    ret.push(getEventFromRow(r));
  }
  return ret;
}

export function getAllEvents(): Promise<EventData[]> {
  return new Promise((resolve, reject) => {
    db.all(GET_ALL_EVENTS, [], function (err, rows) {
      if (err) {
        return reject(err);
      }
      return resolve(getEventDataFromRows(rows));
    });
  });
}

export function getEvents(eventRange: EventDataRange): Promise<EventData[]> {
  return new Promise((resolve, reject) => {
    db.all(GET_EVENTS_RANGE, [eventRange.fromDate.getTime(), eventRange.toDate.getTime()], function (err, rows) {
      if (err) {
        return reject(err);
      }
      return resolve(getEventDataFromRows(rows));
    });
  });
}
function insertAddressId(address: string): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(INSERT_ADDRESS, [address], function (error) {
      if (error) {
        return reject(error);
      }
      return resolve(this.lastID);
    });
  });
}

function getOrInsertAddressId(address: string): Promise<number> {
  return new Promise((resolve, reject) => {
    db.all(GET_ADDRESS_ID, [address], function (error, rows) {
      if (error) {
        return reject(error);
      }
      if (rows && rows.length === 1) {
        return resolve(rows[0]['address_id']);
      }
      return resolve(insertAddressId(address));
    });
  });
}

export async function addEventToDb(event: EventData): Promise<EventData> {
  //returns the input value, but also the new key

  const addressId: number = await getOrInsertAddressId(event.address);
  return new Promise((resolve, reject) => {
    db.run(
      INSERT_EVENT,
      [event.title, event.startTime.getTime(), event.endTime.getTime(), event.status, addressId],
      function (error) {
        if (error) {
          return reject(error);
        }
        const ret: EventData = { ...event };
        ret.eventId = this.lastID;
        return resolve(ret);
      },
    );
  });
}

export async function bulkAddEvents(events: EventData[]): Promise<EventData[]> {
  const ret: EventData[] = [];
  for (const ev of events) {
    const r = await addEventToDb(ev);
    ret.push(r);
  }
  return ret;
}

export default { addEventToDb, getAllEvents, bulkAddEvents, getEvents, getOrInsertAddressId, insertAddressId };
//default export for mocking
