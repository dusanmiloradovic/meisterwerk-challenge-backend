import 'dotenv/config';
import express, { json } from 'express';
import { getAllEvents, bulkInsertEvents, addEvent } from './events';
import { processError, logger } from './errorProcess';
import { EventData, EventDataRange } from './events';

const app = express();
app.use(json());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

const port: number = parseInt(process.env.EXPRESS_PORT);

app.get('/all-events', async (_, res) => {
  try {
    const events = await getAllEvents();
    return res.json(events);
  } catch (e) {
    return processError(e, res);
  }
});

app.get('/get-events/:from/:to', async (req, res) => {
  try {
    console.log(req.params.from);
    console.log(req.params.to);
    console.log(new Date(req.params.from));
    console.log(new Date(req.params.to));

    const queryRange: EventDataRange = { fromDate: new Date(req.params.from), toDate: new Date(req.params.to) };
    const events = await getAllEvents(queryRange);
    return res.json(events);
  } catch (e) {
    return processError(e, res);
  }
});

app.post('/bulk-load-events', async (req, res) => {
  const events: EventData[] = req.body;
  logger.info(events);
  try {
    await bulkInsertEvents(events, true);
    return res.json(null);
  } catch (e) {
    return processError(e, res);
  }
});

app.post('/add-event', (req, res) => {
  const event: EventData = req.body;
  event.startTime = new Date(event.startTime);
  event.endTime = new Date(event.endTime);
  logger.info('calling add event');
  logger.info(event);

  addEvent(event)
    .then((_) => {
      return res.json(null).end();
    })
    .catch((e) => {
      return processError(e, res).end();
    });
});

app.listen(port, () => {
  console.log('Express started');
});
