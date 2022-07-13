import { getAllEvents, bulkInsertEvents } from './index';
import { eventData, overlappingEvent } from './mockEventsData';
import dbAccess from '../db/dbaccess';

jest.mock('../db/dbaccess');
const mockedDbAccess = dbAccess as jest.Mocked<typeof dbAccess>;
describe('Data access test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('db select test', async () => {
    mockedDbAccess.getAllEvents.mockResolvedValue(eventData);
    await expect(getAllEvents()).resolves.toBe(eventData);
  });
  it('count number of inserts', async () => {
    await bulkInsertEvents(eventData);
    expect(mockedDbAccess.addEventToDb.mock.calls.length === eventData.length);
  });
  it('count number of address inserts', async () => {
    const newEvent = {
      ...overlappingEvent,
      startTime: new Date(2050, 6, 1, 14, 30),
      endTime: new Date(2050, 6, 1, 17, 30),
    };
    const newEvents = [...eventData, newEvent];

    await bulkInsertEvents(newEvents);
    expect(mockedDbAccess.addEventToDb.mock.calls.length === newEvents.length);
    expect(mockedDbAccess.insertAddressId.mock.calls.length === newEvents.length - 1); //because we have 2 same addresses in input data
  });
});
