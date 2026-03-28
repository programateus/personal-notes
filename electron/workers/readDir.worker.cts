import { workerData, parentPort } from "worker_threads";
import { readDir } from "../utils/fileSystem";

const { dirPath } = workerData as { dirPath: string };

readDir(dirPath)
  .then((nodes) => parentPort!.postMessage({ nodes }))
  .catch((err: Error) => parentPort!.postMessage({ error: err.message }));
