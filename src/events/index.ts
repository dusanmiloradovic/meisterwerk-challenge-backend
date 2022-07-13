import { getAllEvents as getDBAllEvents, getEvents, addEventToDb } from '../db/dbaccess';
import { logger } from '../errorProcess';

export interface EventData {
  eventId?: number; //event id will be set automatically from the db, that why its optional
  title: string;
  startTime: Date;
  endTime: Date;
  status: string;
  address: string;
}

export interface EventDataRange {
  fromDate: Date;
  toDate: Date;
}

export async function getAllEvents(range?: EventDataRange): Promise<EventData[]> {
  if (range && range.fromDate.getTime() >= range.toDate.getTime()) {
    throw new Error('Invalid range');
  }
  if (!range) {
    return await getDBAllEvents();
  }
  return await getEvents(range);
}

export async function addEvent(event: EventData) {
  //coming from the browser
  event.startTime = event.startTime ? new Date(event.startTime) : null;
  event.endTime = event.endTime ? new Date(event.endTime) : null;

  if (event.startTime.getTime() >= event.endTime.getTime()) {
    throw new Error('Start date must be before the end date');
  }
  const events = await getAllEvents();

  const alreadyBooked = eventExists(event, events);
  if (alreadyBooked) {
    throw new Error('Event already exists or is overlapping');
  }
  await addEventToDb(event);
}

export function eventExists(event: EventData, events: EventData[]): boolean {
  //  const events = await getAllEvents();

  const eventStartTime = event.startTime.getTime();
  const eventEndTime = event.endTime.getTime();
  const existingEvents = events.filter((e) => {
    if (e.address != event.address) {
      return false;
    }
    const eStartTime = e.startTime.getTime();
    const eEndTime = e.endTime.getTime();

    if (
      (eStartTime >= eventStartTime && eStartTime < eventEndTime) ||
      (eEndTime > eventStartTime && eEndTime <= eventEndTime)
    ) {
      return true;
    }
    return false;
  });
  return existingEvents.length > 0;
}

export async function bulkInsertEvents(events: EventData[], ignoreErrors?: boolean) {
  //verify for duplicates, before the insert
  const passedEvents: EventData[] = [];
  for (const ev of events) {
    //The data comes as string from the browser
    ev.startTime = ev.startTime ? new Date(ev.startTime) : null;
    ev.endTime = ev.endTime ? new Date(ev.endTime) : null;
    if (eventExists(ev, passedEvents)) {
      if (ignoreErrors) {
        logger.error(`Overlaps in data for ${ev.title} and ${ev.address}`);
        continue;
      } else {
        throw new Error('Overlaps in data');
      }
    }
    passedEvents.push(ev);
    await addEventToDb(ev);
  }
}
