require('dotenv').config();
const exec = require('child_process').exec;

const args = process.argv.slice(2);

const eventTypes = [
  'poll-begin',
  'poll-end',
  'poll-progress',
  'prediction-begin',
  'prediction-end',
  'prediction-lock',
  'prediction-progress',
];

if (args.length === 0 || !eventTypes.includes(args[0])) {
  console.error(
    'Twitch event type argument invalid or missing.\nAccepted values: ',
    eventTypes.join(', ')
  );
  process.exit(0);
}

exec(
  `twitch event trigger ${args[0]} -F http://localhost:8080/eventsub -s ${process.env.TWITCH_EVENTSUB_SECRET}`,
  (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    }
  }
);
