import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "Delete all old files marked for deletion",  {
    hours: 24,
  },
  internal.files.deleteAllFiles,
);

export default crons;