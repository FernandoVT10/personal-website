import mongoose from "mongoose";

import startServer from "./app";

mongoose.connect("mongodb://localhost:27017/personal-website", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

startServer();
