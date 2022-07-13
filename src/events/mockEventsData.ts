import { EventData } from './index';
const eventData: EventData[] = [
  {
    title: 'Team Building Crealogix',
    startTime: new Date(2022, 9, 1, 8, 30),
    endTime: new Date(2022, 9, 1, 9, 30),
    address: 'Paintball arena, Lucerne',
    status: 'Confirmed',
  },
  {
    title: 'ADIPEC conference',
    startTime: new Date(2022, 9, 14, 8, 0),
    endTime: new Date(2022, 10, 1, 17, 0),
    address: 'Abu Dhabi Exhibition Centre',
    status: 'Confirmed',
  },
  {
    title: 'Doctor appointment',
    startTime: new Date(2022, 8, 1, 8, 0),
    endTime: new Date(2022, 8, 1, 8, 30),
    address: 'MedArt Hospital',
    status: 'Confirmed',
  },
];

const overlappingEvent = {
  title: 'Appendix removal',
  startTime: new Date(2022, 8, 1, 8, 15),
  endTime: new Date(2022, 8, 1, 8, 45),
  address: 'MedArt Hospital',
  status: 'Pending',
};
export { eventData, overlappingEvent };
