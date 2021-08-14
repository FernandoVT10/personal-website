import mongoose from "mongoose";

import startServer from "./app";
import { MONGODB_URI } from "./config";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

startServer();
