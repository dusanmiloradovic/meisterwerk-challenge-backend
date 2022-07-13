import { EventData, EventDataRange, getAllEvents, addEvent, eventExists, bulkInsertEvents } from './index';
import { eventData, overlappingEvent } from './mockEventsData';

describe('Events test', () => {
  it('insert data,if end date is before the start date, function should throw exception', async () => {
    const insertData: EventData = {
      title: 'Test event',
      startTime: new Date(2022, 9, 1),
      endTime: new Date(2022, 8, 1),
      status: 'Pending',
      address: 'Communicity Center, Vracar',
    };
    expect.assertions(1);
    await expect(addEvent(insertData)).rejects.toThrow();
  });
  it('Check the range for getting the data', async () => {
    const range: EventDataRange = {
      fromDate: new Date(2022, 9, 1),
      toDate: new Date(2022, 8, 1),
    };
    await expect(getAllEvents(range)).rejects.toThrow();
  });
  it('Verify the data already exists', async () => {
    const exists = await eventExists(overlappingEvent, eventData);
    expect(exists).toBe(true);
  });
  it('Check bulk insert', async () => {
    await expect(bulkInsertEvents(eventData)).resolves.toBe(undefined);
    await expect(bulkInsertEvents([...eventData, overlappingEvent])).rejects.toThrow();
  });
});
