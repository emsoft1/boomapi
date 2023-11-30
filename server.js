const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors"); // Add this line
const {
    runGraphInFile,
    loadProjectFromString,
    DataValue,
} = require("@ironclad/rivet-node");
const fs = require("fs");
const express = require("express"); // Add this line
const app = express(); // Add this line
const datastore = require("./data");
app.use(cors({ origin: "*" })); // Add this line
app.options("*", cors());
const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    // console.log("> var datastore", datastore.storyCatsample);
    // Handle the event from the client to run the Rivet graph
    socket.on("prompt", async (data) => {
        console.log("> var data", data);
        //create 4000 ms delay
        await new Promise((resolve) => setTimeout(resolve, 4000));
        console.log("> var done");
        socket.emit("promptresult", datastore.storyCatsample);
    });
    socket.on("cat", async (data) => {
        console.log("> var data", data);
        //create 4000 ms delay
        await new Promise((resolve) => setTimeout(resolve, 4000));
        console.log("> var done");
        socket.emit("school", {
            Geographielehrer: datastore.Geographielehrer,
            Deutsch_Lehrer: datastore.Deutsch_Lehrer,
            Sozialkunde: datastore.Sozialkunde,
            Geschichtslehrer: datastore.Geschichtslehrer,
        });
    });
    socket.on("teacher", async (data) => {
        console.log("> var data", data);
        //create 4000 ms delay
        await new Promise((resolve) => setTimeout(resolve, 4000));
        console.log("> var done");
        socket.emit("results", datastore.results);
    });

    socket.on("run_rivet_graph", async (data) => {
        // const test = async () => {
        try {
            const output = await runGraphInFile(
                "UntitledProject.rivet-project",
                {
                    graph: "main",
                    inputs: {
                        input: "medi is here ",
                    },
                    onUserInput: async (prompt) => {
                        // This is called when the graph needs user input
                        // For this example, we'll just return a random number
                        console.log("prompt", prompt);
                        console.log("> var processId");
                        //create a answer and send it bck
                        prompt.callback({
                            type: "string",
                            value: "Hello! I'm an AI language model and",
                        });
                        return ["medi is here"];
                    },
                    openAiKey:
                        "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",
                }
            );
            console.log("check: ", output); // This will log the graph's output

            return output;
        } catch (error) {
            console.error("Error running Rivet graph:", error);
        }
        // };
        // Send the result back to the React frontend
        socket.emit("rivet_result", result);
    });
});
// test();
server.listen(3020, () => {
    console.log("Server is running on port 3020");
});
